const ORIGIN_STYLES = {
  general: "bg-gray-700 text-gray-200",
  programming_course: "bg-blue-600/20 text-blue-400",
  reactjs_web_development_course: "bg-cyan-600/20 text-cyan-400",
  "3d_printing_design_course": "bg-purple-600/20 text-purple-400",
  pygame_game_development_course: "bg-green-600/20 text-green-400",
}

const ORIGIN_LABELS = {
  general: "General",
  programming_course: "Programming",
  reactjs_web_development_course: "ReactJS",
  "3d_printing_design_course": "3D Printing",
  pygame_game_development_course: "Pygame",
}

export default function LeadSidePage({ selectedLead, onClose }) {
    if (!selectedLead) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-[380px] bg-slate-900 border-l border-slate-800 shadow-xl z-50 flex flex-col text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-xl font-semibold text-slate-100">Lead Details</h2>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
                >
                    ×
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex flex-col gap-6">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                        <span className="text-slate-400 text-2xl">👤</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-100">
                        {selectedLead.first} {selectedLead.last}
                        </h3>
                        {/* <p className="text-slate-400">{selectedLead.company}</p> */}
                    </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-4 mt-4">
                    {/* Email */}
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/60">
                        <span className="text-slate-400 text-lg">✉️</span>
                        <div>
                        <p className="text-sm text-slate-400">Email</p>
                        <p className="text-base font-medium text-slate-100">
                            {selectedLead.email}
                        </p>
                        </div>
                    </div>

                    {/* Origin */}
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/60">
                        <span className="text-slate-400 text-lg">📍</span>
                        <div>
                            <p className="text-sm text-slate-400">Origin</p>
                            <span
                                className={`inline-block mt-1 px-3 py-1 text-sm rounded-full ${
                                    ORIGIN_STYLES[selectedLead.source] ?? ORIGIN_STYLES.general
                                }`}
                                >
                                {ORIGIN_LABELS[selectedLead.source] ?? "General"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
