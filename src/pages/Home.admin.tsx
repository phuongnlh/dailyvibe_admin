import { motion } from "framer-motion";
import { Activity, Eye, FileText, MessageSquare, Shield, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDailyInteractions, getPostStats, getStatsData, getUserGrowth } from "../api/admin";
import AdminLayout from "../components/AdminLayout";

const moderationData = [
  { hour: "00", reported: 5, resolved: 4, pending: 1 },
  { hour: "04", reported: 8, resolved: 6, pending: 2 },
  { hour: "08", reported: 15, resolved: 12, pending: 3 },
  { hour: "12", reported: 25, resolved: 20, pending: 5 },
  { hour: "16", reported: 30, resolved: 25, pending: 5 },
  { hour: "20", reported: 20, resolved: 18, pending: 2 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
  });

  const [postData, setPostData] = useState([
    { name: "Text", value: 0, color: "#6366F1" },
    { name: "Image", value: 0, color: "#10B981" },
    { name: "Video", value: 0, color: "#F59E0B" },
    { name: "Link", value: 0, color: "#EF4444" },
  ]);
  const [userGrowthData, setUserGrowthData] = useState([
    { month: "Jan", users: 0, newUsers: 0 },
    { month: "Feb", users: 0, newUsers: 0 },
    { month: "Mar", users: 0, newUsers: 0 },
    { month: "Apr", users: 0, newUsers: 0 },
    { month: "May", users: 0, newUsers: 0 },
    { month: "Jun", users: 0, newUsers: 0 },
  ]);

  const [dailyInteractionsData, setDailyInteractionsData] = useState([
    { day: "Mon", reactions: 0, comments: 0, shares: 0 },
    { day: "Tue", reactions: 0, comments: 0, shares: 0 },
    { day: "Wed", reactions: 0, comments: 0, shares: 0 },
    { day: "Thu", reactions: 0, comments: 0, shares: 0 },
    { day: "Fri", reactions: 0, comments: 0, shares: 0 },
    { day: "Sat", reactions: 0, comments: 0, shares: 0 },
    { day: "Sun", reactions: 0, comments: 0, shares: 0 },
  ]);

  useEffect(() => {
    const getStats = async () => {
      const stats = await getStatsData();
      const post_stats = await getPostStats();
      const userGradient = await getUserGrowth();
      const dailyInteractions = await getDailyInteractions();
      setUserGrowthData(userGradient.data);
      setStats(stats.data);
      setPostData(post_stats.data);
      setDailyInteractionsData(dailyInteractions.data);
    };
    getStats();
  }, []);

  const filteredData = postData.filter((item) => item.value > 0);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            icon={FileText}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            title="Total Comments"
            value={stats.totalComments}
            icon={MessageSquare}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            icon={Eye}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Growth</h2>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Last 6 months</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#userGradient)"
                  name="Total Users"
                />
                <Line type="monotone" dataKey="newUsers" stroke="#06B6D4" strokeWidth={2} name="New Users" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Post Types Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                Content Distribution
              </h2>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Chart */}

            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={filteredData.length > 0 ? filteredData : [{ name: "No Data", value: 1 }]} // dữ liệu giả khi trống
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={70}
                  paddingAngle={filteredData.length > 0 ? 3 : 0}
                  cornerRadius={filteredData.length > 0 ? 8 : 0}
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    filteredData.length > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  {(filteredData.length > 0 ? filteredData : [{ color: "#E5E7EB" }]).map((entry, index) => (
                    <Cell
                      key={index}
                      fill={filteredData.length > 0 ? entry.color : "#E5E7EB"} // màu xám nhạt
                      stroke="none"
                    />
                  ))}
                </Pie>

                {filteredData.length > 0 && (
                  <Tooltip
                    formatter={(value, name) => [`${value}`, name]}
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                    labelStyle={{ color: "#9CA3AF" }}
                    itemStyle={{ color: "#F9FAFB" }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Interactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daily Interactions</h2>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={[...dailyInteractionsData].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="day" stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Bar dataKey="reactions" fill="#EF4444" name="Reactions" radius={[2, 2, 0, 0]} />
                <Bar dataKey="comments" fill="#10B981" name="Comments" radius={[2, 2, 0, 0]} />
                <Bar dataKey="shares" fill="#F59E0B" name="Shares" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Moderation Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Moderation Activity</h2>
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={moderationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="hour" stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="reported"
                  stroke="#EF4444"
                  strokeWidth={3}
                  name="Reported"
                  dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Resolved"
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  name="Pending"
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
