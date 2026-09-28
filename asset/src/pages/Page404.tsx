import React from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import BaseUrl from "@/consts/baseUrl";

const Page404 = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-[7rem] font-bold leading-tight">404</h1>
        <span className="font-medium">Không tìm thấy trang</span>
        <p className="text-muted-foreground">
          Trang bạn đang tìm không tồn tại
          <br />
          hoặc đã bị di chuyển.
        </p>
        <Link to={BaseUrl.Homepage} className={buttonVariants({ className: "mt-6" })}>
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default React.memo(Page404);
