import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

// Trên Windows, file có thể bị antivirus/editor giữ tạm thời khi rename
const RETRYABLE_CODES = new Set(['EPERM', 'EBUSY', 'EACCES']);

/**
 * Lưu một collection vào một file JSON.
 * - Dữ liệu được cache trong bộ nhớ; các thao tác ghi được xếp hàng chạy tuần tự.
 * - Ghi ra file tạm rồi rename, nên file không bị hỏng nếu server tắt giữa chừng.
 */
export class JsonStore {
  #file;
  #defaultValue;
  #data;
  #loading;
  #queue = Promise.resolve();

  constructor(file, defaultValue) {
    this.#file = file;
    this.#defaultValue = defaultValue;
  }

  async init() {
    await this.#load();
  }

  /**
   * Đọc dữ liệu. `selector` nhận dữ liệu gốc (chỉ đọc, không được sửa);
   * giá trị trả về là bản sao nên nơi gọi có thể thoải mái chỉnh sửa.
   */
  async read(selector = (data) => data) {
    const data = await this.#load();
    return structuredClone(selector(data));
  }

  /**
   * Sửa dữ liệu. `mutator` được sửa trực tiếp trên một bản nháp; bản nháp chỉ thay
   * dữ liệu cũ khi ghi file thành công. Nếu `mutator` throw thì không có gì thay đổi.
   */
  update(mutator) {
    const task = this.#queue.then(async () => {
      const draft = structuredClone(await this.#load());
      const result = await mutator(draft);
      await this.#write(draft);
      this.#data = draft;
      return structuredClone(result);
    });
    this.#queue = task.catch(() => {});
    return task;
  }

  #load() {
    this.#loading ??= this.#readFile().then(
      (data) => {
        this.#data = data;
      },
      (err) => {
        this.#loading = undefined;
        throw err;
      },
    );
    return this.#loading.then(() => this.#data);
  }

  async #readFile() {
    let text;
    try {
      text = await fs.readFile(this.#file, 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      text = '';
    }

    // Bỏ BOM (Notepad trên Windows hay thêm vào khi lưu UTF-8)
    text = text.replace(/^﻿/, '');
    if (text.trim() === '') {
      const data = structuredClone(this.#defaultValue);
      await this.#write(data);
      return data;
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      // Không ghi đè file hỏng để tránh mất dữ liệu — cần sửa tay
      throw new Error(`File ${this.#file} không phải JSON hợp lệ: ${err.message}`, { cause: err });
    }
  }

  async #write(data) {
    await fs.mkdir(path.dirname(this.#file), { recursive: true });
    const tmpFile = `${this.#file}.tmp`;
    await fs.writeFile(tmpFile, JSON.stringify(data, null, 2));

    for (let attempt = 1; ; attempt++) {
      try {
        await fs.rename(tmpFile, this.#file);
        return;
      } catch (err) {
        if (!RETRYABLE_CODES.has(err.code) || attempt >= 5) throw err;
        await sleep(50 * attempt);
      }
    }
  }
}
