import React from "react";
import AdminLayout from "../components/AdminLayout";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

const Analytics: React.FC = () => {
  // Sample analytics data
  const trafficData = [
    { month: "Jan", sessions: 4000, pageViews: 12000, bounceRate: 45 },
    { month: "Feb", sessions: 5200, pageViews: 15600, bounceRate: 42 },
    { month: "Mar", sessions: 6800, pageViews: 20400, bounceRate: 38 },
    { month: "Apr", sessions: 8100, pageViews: 24300, bounceRate: 35 },
    { month: "May", sessions: 9500, pageViews: 28500, bounceRate: 33 },
    { month: "Jun", sessions: 11200, pageViews: 33600, bounceRate: 31 },
  ];

  const deviceData = [
    { name: "Desktop", value: 45, color: "#8B5CF6" },
    { name: "Mobile", value: 40, color: "#06B6D4" },
    { name: "Tablet", value: 15, color: "#10B981" },
  ];

  const topPages = [
    { page: "/", views: 15420, percentage: 25.6 },
    { page: "/posts", views: 12380, percentage: 20.5 },
    { page: "/profile", views: 9850, percentage: 16.3 },
    { page: "/explore", views: 7230, percentage: 12.0 },
    { page: "/messages", views: 5680, percentage: 9.4 },
  ];

  const realTimeData = [
    { time: "12:00", users: 245 },
    { time: "12:05", users: 268 },
    { time: "12:10", users: 289 },
    { time: "12:15", users: 312 },
    { time: "12:20", users: 295 },
    { time: "12:25", users: 323 },
    { time: "12:30", users: 356 },
  ];

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => {
    const isPositive = change >= 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          </div>
          <div className={`p-3 rounded-2xl ${color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AdminLayout
      title="Analytics"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Analytics" }]}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Sessions"
            value="45.2K"
            change={15.3}
            icon={Users}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Page Views"
            value="128.4K"
            change={23.1}
            icon={Eye}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            title="Avg. Session Duration"
            value="4m 32s"
            change={8.7}
            icon={Clock}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Bounce Rate"
            value="31.2%"
            change={-5.2}
            icon={MousePointer}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Traffic Overview
              </h2>
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient
                    id="sessionsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="pageViewsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
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
                  dataKey="sessions"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#sessionsGradient)"
                  name="Sessions"
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#06B6D4"
                  fillOpacity={1}
                  fill="url(#pageViewsGradient)"
                  name="Page Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Device Distribution
              </h2>
              <Smartphone className="w-5 h-5 text-purple-500" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Device Stats */}
            <div className="mt-4 space-y-3">
              {deviceData.map((device, index) => {
                const Icon =
                  device.name === "Desktop"
                    ? Monitor
                    : device.name === "Mobile"
                    ? Smartphone
                    : Tablet;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {device.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: device.color }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {device.value}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real-time Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Real-time Users
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-500">Live</span>
              </div>
            </div>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-green-500">323</p>
              <p className="text-sm text-gray-500">Active users right now</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={realTimeData}>
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Pages
              </h2>
              <Eye className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {page.page}
                      </p>
                      <p className="text-sm text-gray-500">
                        {page.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {page.percentage}%
                    </p>
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${page.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
