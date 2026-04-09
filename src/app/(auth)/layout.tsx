interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      
      {/* ✅ Paste your background HERE */}
      <div className="absolute top-0 left-0 h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.28),rgba(255,255,255,0))]" />
      
      {/* Page content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;