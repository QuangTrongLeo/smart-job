import { mockCategories, mockExperiences, mockJobTypes } from '~/mockData/jobsData';

function JobFilterSidebar() {
  return (
    <aside className="w-full md:w-1/4 flex flex-col gap-md">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-md pb-sm border-b border-outline-variant">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Bộ lọc</h2>
          <button className="font-label-sm text-label-sm text-primary hover:underline">Xóa bộ lọc</button>
        </div>

        {/* Danh mục */}
        <div className="mb-lg">
          <h3 className="font-label-md text-label-md text-on-surface mb-sm">Danh mục</h3>
          <div className="flex flex-col gap-sm">
            {mockCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-sm cursor-pointer">
                <input className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-primary-container" type="checkbox" />
                <span className="font-body-sm text-body-sm text-on-surface-variant">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Kinh nghiệm */}
        <div className="mb-lg">
          <h3 className="font-label-md text-label-md text-on-surface mb-sm">Kinh nghiệm</h3>
          <div className="flex flex-col gap-sm">
            {mockExperiences.map((exp) => (
              <label key={exp.id} className="flex items-center gap-sm cursor-pointer">
                <input className="w-4 h-4 border-outline-variant text-primary-container focus:ring-primary-container" name="experience" type="radio" />
                <span className="font-body-sm text-body-sm text-on-surface-variant">{exp.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Hình thức */}
        <div className="mb-lg">
          <h3 className="font-label-md text-label-md text-on-surface mb-sm">Hình thức</h3>
          <div className="flex flex-wrap gap-xs">
            {mockJobTypes.map((type, idx) => (
              <button key={idx} className="bg-background text-on-surface-variant font-label-sm text-label-sm px-sm py-xs rounded-full border border-outline-variant hover:bg-surface-variant/50 transition-colors">
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default JobFilterSidebar;