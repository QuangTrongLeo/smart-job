function JobCard({ job }) {
  const isHighMatch = job.matchScore >= 80;

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-md">
        <div className="flex gap-md">
          <div className="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center shrink-0">
            <i className={`bi ${job.icon} text-primary-container text-xl`}></i>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary-container transition-colors">
              {job.title}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              {job.company} • {job.location}
            </p>
          </div>
        </div>
        <button className="text-on-surface-variant hover:text-primary-container transition-colors">
          <i className="bi bi-bookmark"></i>
        </button>
      </div>

      <div className="flex flex-wrap gap-xs mb-md">
        {job.tags.map((tag, idx) => (
          <span key={idx} className="bg-[#EFF6FF] text-[#2563EB] font-label-sm text-label-sm px-sm py-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-sm border-t border-outline-variant/50">
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs text-on-surface-variant font-body-sm text-body-sm">
            <i className="bi bi-cash-stack"></i>
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-xs text-on-surface-variant font-body-sm text-body-sm">
            <i className="bi bi-clock"></i>
            <span>{job.postedTime}</span>
          </div>
        </div>

        <div className={`flex items-center gap-xs px-sm py-xs rounded-full border ${
          isHighMatch ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
        }`}>
          <i className="bi bi-stars"></i>
          <span className="font-label-sm text-label-sm">{job.matchScore}% Phù hợp</span>
        </div>
      </div>
    </div>
  );
}

export default JobCard;