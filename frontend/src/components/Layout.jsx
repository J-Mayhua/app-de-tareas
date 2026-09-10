function Layout({ children }) {
    return (
        <div className="min-h-screen bg-bg text-text font-sans">
            <div className="max-w-3xl mx-auto px-4 py-10">
                {children}
            </div>
        </div>
    );
}

export default Layout;
