function JobHeroSearch() {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg md:p-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-md">
        Tìm kiếm công việc mơ ước của bạn
      </h1>
      <div className="flex flex-col md:flex-row gap-sm">
        <div className="relative flex-grow">
          <i className="bi bi-search absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant"></i>
          <input
            className="w-full pl-xxl pr-md py-md bg-background border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
            placeholder="Tìm kiếm công việc hoặc kỹ năng..."
            type="text"
          />
        </div>
        <div className="relative w-full md:w-64">
          <i className="bi bi-geo-alt absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant"></i>
          <input
            className="w-full pl-xxl pr-md py-md bg-background border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
            placeholder="Địa điểm"
            type="text"
          />
        </div>
        <button className="bg-primary-container text-on-primary font-label-md text-label-md px-xl py-md rounded-lg hover:brightness-90 transition-all active:scale-95 flex items-center justify-center gap-sm">
          <i className="bi bi-search"></i> Tìm việc
        </button>
      </div>
    </section>
  );
}

export default JobHeroSearch;