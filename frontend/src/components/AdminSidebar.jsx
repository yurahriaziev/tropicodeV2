import { Home, Activity, Server, MessageSquare, UserPlus, LinkIcon } from "lucide-react";

export default function AdminSideBar({ activeTab, setActiveTab, adminName }) {
    const navigation = [
        { name: "Dashboard", key: "dashboard", icon: Home },
        { name: "Account Activity", key: "activity", icon: Activity },
        { name: "Server Logs", key: "logs", icon: Server },
        { name: "Messages", key: "messages", icon: MessageSquare },
        { name: "New Account", key: "newAccount", icon: UserPlus },
        { name: "Generate Link", key: "generateLink", icon: LinkIcon }
    ]

    return (
        <div className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {/* Logo Section */}
            <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-6">
                <h1 className="text-xl font-bold text-white">{adminName}</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = activeTab === item.key;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                isActive
                                ? "bg-purple-600 text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                        <Icon className="h-5 w-5" />
                            {item.name}
                        </button>
                    );
                })}
            </nav>
        </div>
    )
}