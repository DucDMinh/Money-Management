import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = (props: DefaultLayoutProps) => {
  return (
    <div className="component:DefaultLayout flex min-h-[100vh] bg-muted/40">
      <Sidebar />

      <div className="layout-wrapper w-full p-3 md:w-[calc(100%-var(--sidebar-width))] md:px-8">
        <Navbar />
        <main className="mx-auto flex w-full max-w-6xl">{props.children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default DefaultLayout;
