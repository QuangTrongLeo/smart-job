import JobHeroSearch from '~/components/JobHeroSearch';
import JobFilterSidebar from '~/components/JobFilterSidebar';
import JobCard from '~/components/JobCard';
import { mockJobList } from '~/mockData/jobsData';
import styles from './Jobs.module.scss';

function Jobs() {
  return (
    <main className={`flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-lg ${styles.jobsContainer}`}>
      <JobHeroSearch />

      <div className="flex flex-col md:flex-row gap-gutter">
        <JobFilterSidebar />

        <section className="w-full md:w-3/4 flex flex-col gap-md">
          <div className="flex items-center justify-between pb-sm border-b border-outline-variant">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Tìm thấy <span className="font-bold text-on-surface">{mockJobList.length}</span> việc làm phù hợp
            </p>
            <div className="flex items-center gap-sm">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Sắp xếp theo:</span>
              <select className="bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface py-xs pl-sm pr-lg focus:outline-none focus:border-primary-container">
                <option>Phù hợp nhất</option>
                <option>Mới nhất</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-md">
            {mockJobList.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Jobs;