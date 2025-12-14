import { useCallback } from "react";

const MEETING_TYPES = [
  { value: "", label: "All Types" },
  { value: "team", label: "Team Meeting" },
  { value: "one-on-one", label: "1-on-1" },
  { value: "client", label: "Client Meeting" },
  { value: "standup", label: "Standup" },
  { value: "project-review", label: "Project Review" },
  { value: "brainstorm", label: "Brainstorming" },
  { value: "interview", label: "Interview" },
  { value: "training", label: "Training" },
  { value: "other", label: "Other" },
];

function FilterPanel({ filters, onFilterChange, isExpanded, onToggle }) {
  const handleClearFilters = useCallback(() => {
    onFilterChange({
      dateFrom: null,
      dateTo: null,
      meetingType: null,
      tags: [],
    });
  }, [onFilterChange]);

  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.meetingType ||
    (filters.tags && filters.tags.length > 0);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className={`group flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
          isExpanded
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-slate-100 hover:border-slate-600 hover:bg-slate-800"
        }`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-emerald-500 text-white rounded-full">
            {[filters.dateFrom, filters.dateTo, filters.meetingType, filters.tags?.length].filter(Boolean).length}
          </span>
        )}
      </button>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-xs font-medium text-slate-500 hover:text-red-400 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
}

function FilterPanelExpanded({ filters, onFilterChange }) {
  const handleDateFromChange = (e) => {
    onFilterChange({ ...filters, dateFrom: e.target.value || null });
  };

  const handleDateToChange = (e) => {
    onFilterChange({ ...filters, dateTo: e.target.value || null });
  };

  const handleMeetingTypeChange = (e) => {
    onFilterChange({ ...filters, meetingType: e.target.value || null });
  };

  const handleTagsChange = (e) => {
    const tagsValue = e.target.value;
    const tagsArray = tagsValue
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    onFilterChange({ ...filters, tags: tagsArray });
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-400">From Date</label>
        <input
          type="date"
          value={filters.dateFrom || ""}
          onChange={handleDateFromChange}
          className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700/60 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-400">To Date</label>
        <input
          type="date"
          value={filters.dateTo || ""}
          onChange={handleDateToChange}
          className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700/60 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-400">Meeting Type</label>
        <select
          value={filters.meetingType || ""}
          onChange={handleMeetingTypeChange}
          className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700/60 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
        >
          {MEETING_TYPES.map((type) => (
            <option key={type.value} value={type.value} className="bg-slate-800">
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-400">Filter by Tags</label>
        <input
          type="text"
          value={(filters.tags || []).join(", ")}
          onChange={handleTagsChange}
          placeholder="urgent, follow-up"
          className="w-full px-3 py-2.5 bg-slate-900/50 border border-slate-700/60 rounded-lg text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all"
        />
      </div>
    </div>
  );
}

export { FilterPanelExpanded };
export default FilterPanel;

