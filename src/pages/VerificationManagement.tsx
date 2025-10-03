import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Upload,
  Download,
  Eye,
  User,
  FileText,
  Image,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  Badge,
  Verified,
  Camera,
  Award,
  Users,
} from "lucide-react";

const VerificationManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);

  const verificationRequests = [
    {
      id: 1,
      user: {
        id: 401,
        name: "Dr. Sarah Johnson",
        username: "@drsarahjohnson",
        email: "sarah.johnson@medical.edu",
        avatar: "/avatar-1.jpg",
        followerCount: 125000,
        accountAge: "2 years",
        bio: "Professor of Medicine at Stanford University. Researcher in cardiovascular health.",
      },
      requestType: "expert",
      category: "Healthcare Professional",
      submittedAt: "2024-03-15T10:30:00Z",
      status: "pending",
      documents: [
        {
          type: "medical_license",
          name: "Medical_License_2024.pdf",
          verified: true,
        },
        {
          type: "university_id",
          name: "Stanford_Faculty_ID.jpg",
          verified: true,
        },
        {
          type: "professional_photo",
          name: "Professional_Headshot.jpg",
          verified: false,
        },
      ],
      verificationBadge: "Medical Expert",
      priority: "high",
      notes:
        "Prominent researcher with significant contributions to medical literature.",
      reviewedBy: null,
      socialProof: {
        linkedinVerified: true,
        universityEmail: true,
        publicRecords: true,
      },
    },
    {
      id: 2,
      user: {
        id: 402,
        name: "TechInfluencer99",
        username: "@techinfluencer99",
        email: "contact@techinfluencer99.com",
        avatar: "/avatar-2.jpg",
        followerCount: 85000,
        accountAge: "1.5 years",
        bio: "Tech reviewer and content creator. Unboxing the latest gadgets.",
      },
      requestType: "creator",
      category: "Content Creator",
      submittedAt: "2024-03-14T16:45:00Z",
      status: "reviewing",
      documents: [
        {
          type: "content_portfolio",
          name: "YouTube_Analytics.pdf",
          verified: true,
        },
        {
          type: "brand_partnerships",
          name: "Partnership_Contracts.pdf",
          verified: false,
        },
        { type: "government_id", name: "Drivers_License.jpg", verified: true },
      ],
      verificationBadge: "Verified Creator",
      priority: "medium",
      notes: "Consistent content creation with growing audience engagement.",
      reviewedBy: {
        id: 901,
        name: "Admin John",
        username: "@admin_john",
      },
      socialProof: {
        youtubeVerified: true,
        twitterVerified: false,
        instagramVerified: true,
      },
    },
    {
      id: 3,
      user: {
        id: 403,
        name: "Jane Smith",
        username: "@janesmith_official",
        email: "jane@janesmith.com",
        avatar: "/avatar-3.jpg",
        followerCount: 45000,
        accountAge: "3 years",
        bio: "Author of bestselling novels. Public speaker and writing coach.",
      },
      requestType: "public_figure",
      category: "Author",
      submittedAt: "2024-03-13T20:15:00Z",
      status: "approved",
      documents: [
        {
          type: "published_works",
          name: "Book_Publication_Records.pdf",
          verified: true,
        },
        { type: "media_coverage", name: "Press_Articles.pdf", verified: true },
        { type: "government_id", name: "Passport.pdf", verified: true },
      ],
      verificationBadge: "Verified Author",
      priority: "medium",
      notes:
        "Established author with multiple published works and media presence.",
      reviewedBy: {
        id: 902,
        name: "Admin Sarah",
        username: "@admin_sarah",
      },
      socialProof: {
        wikipediaPage: true,
        bookstoreListings: true,
        mediaInterviews: true,
      },
    },
    {
      id: 4,
      user: {
        id: 404,
        name: "FakeInfluencer",
        username: "@fakeinfluencer",
        email: "fake@email.com",
        avatar: "/avatar-4.jpg",
        followerCount: 150000,
        accountAge: "6 months",
        bio: "Celebrity influencer with millions of followers worldwide.",
      },
      requestType: "celebrity",
      category: "Public Figure",
      submittedAt: "2024-03-12T11:30:00Z",
      status: "rejected",
      documents: [
        { type: "government_id", name: "Suspicious_ID.jpg", verified: false },
        { type: "media_coverage", name: "Fake_Articles.pdf", verified: false },
      ],
      verificationBadge: "Celebrity",
      priority: "low",
      notes:
        "Suspicious documents and inconsistent information. Bot followers detected.",
      reviewedBy: {
        id: 903,
        name: "Admin Mike",
        username: "@admin_mike",
      },
      socialProof: {
        suspiciousActivity: true,
        botFollowers: true,
        fakeDdocuments: true,
      },
    },
    {
      id: 5,
      user: {
        id: 405,
        name: "Local Business Owner",
        username: "@localcafe_downtown",
        email: "owner@localcafe.com",
        avatar: "/avatar-5.jpg",
        followerCount: 2500,
        accountAge: "2.5 years",
        bio: "Family-owned café in downtown. Serving the community since 1985.",
      },
      requestType: "business",
      category: "Local Business",
      submittedAt: "2024-03-11T09:45:00Z",
      status: "pending",
      documents: [
        {
          type: "business_license",
          name: "Business_License_2024.pdf",
          verified: true,
        },
        {
          type: "tax_documents",
          name: "Tax_Registration.pdf",
          verified: false,
        },
        { type: "storefront_photo", name: "Cafe_Exterior.jpg", verified: true },
      ],
      verificationBadge: "Verified Business",
      priority: "low",
      notes: "Long-standing local business with community presence.",
      reviewedBy: null,
      socialProof: {
        googleBusiness: true,
        businessRegistration: true,
        customerReviews: true,
      },
    },
  ];

  const stats = [
    {
      title: "Pending Requests",
      value: "47",
      change: 8.5,
      icon: Clock,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
    {
      title: "Approved Today",
      value: "12",
      change: 25.8,
      icon: CheckCircle,
      color: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: "Under Review",
      value: "23",
      change: -12.3,
      icon: Eye,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Total Verified",
      value: "1.2K",
      change: 15.2,
      icon: Badge,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
  ];

  const tabs = [
    {
      id: "pending",
      label: "Pending",
      count: verificationRequests.filter((r) => r.status === "pending").length,
    },
    {
      id: "reviewing",
      label: "Under Review",
      count: verificationRequests.filter((r) => r.status === "reviewing")
        .length,
    },
    {
      id: "approved",
      label: "Approved",
      count: verificationRequests.filter((r) => r.status === "approved").length,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: verificationRequests.filter((r) => r.status === "rejected").length,
    },
    { id: "all", label: "All Requests", count: verificationRequests.length },
  ];

  const filteredRequests = verificationRequests.filter((request) => {
    switch (selectedTab) {
      case "pending":
        return request.status === "pending";
      case "reviewing":
        return request.status === "reviewing";
      case "approved":
        return request.status === "approved";
      case "rejected":
        return request.status === "rejected";
      default:
        return true;
    }
  });

  const handleSelectRequest = (requestId: number) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map((request) => request.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "reviewing":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
      case "approved":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "government_id":
      case "medical_license":
      case "business_license":
        return <Shield className="w-4 h-4" />;
      case "professional_photo":
      case "storefront_photo":
        return <Camera className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

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
                <TrendingUp className="w-4 h-4 text-red-500 mr-1 transform rotate-180" />
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
      title="Verification Management"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Verification Management" },
      ]}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Verification Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  User Verification Requests
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Review and approve user verification requests and badges
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Badge Management */}
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Badge className="w-4 h-4 mr-2" />
                  Manage Badges
                </button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Filter */}
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Filter
                  </span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTab === tab.id
                      ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      selectedTab === tab.id
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRequests.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {selectedRequests.length} request
                  {selectedRequests.length !== 1 ? "s" : ""} selected
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Approve
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Reject
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verification Requests */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  {/* Request Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />

                      <div>
                        <img
                          src={request.user.avatar}
                          alt={request.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {request.user.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {request.user.username}
                          </span>

                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>

                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                              request.priority
                            )}`}
                          >
                            {request.priority} priority
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span>{request.category}</span>
                          <span>•</span>
                          <span>
                            {request.user.followerCount.toLocaleString()}{" "}
                            followers
                          </span>
                          <span>•</span>
                          <span>Account age: {request.user.accountAge}</span>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {request.user.bio}
                        </p>

                        <div className="text-xs text-gray-500">
                          Submitted {formatDate(request.submittedAt)}
                          {request.reviewedBy && (
                            <span>
                              {" "}
                              • Reviewed by {request.reviewedBy.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Requested Badge */}
                  <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-800 dark:text-purple-400">
                        Requesting: {request.verificationBadge}
                      </span>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Submitted Documents ({request.documents.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {request.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex-shrink-0">
                            {getDocumentIcon(doc.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {doc.type.replace("_", " ")}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {doc.verified ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Proof */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Social Proof & Verification
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(request.socialProof).map(
                        ([key, value]) => (
                          <span
                            key={key}
                            className={`px-2 py-1 text-xs rounded-full ${
                              value === true
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                          >
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                            {value === true ? " ✓" : " ✗"}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">
                      Review Notes
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {request.notes}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        Review Details
                      </button>
                      <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <User className="w-4 h-4 mr-1" />
                        View Profile
                      </button>
                      <button className="flex items-center px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                        <Download className="w-4 h-4 mr-1" />
                        Download Docs
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {request.status === "pending" && (
                        <>
                          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Eye className="w-4 h-4 inline mr-1" />
                            Start Review
                          </button>
                          <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Quick Approve
                          </button>
                        </>
                      )}
                      {request.status === "reviewing" && (
                        <>
                          <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Approve
                          </button>
                          <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            <XCircle className="w-4 h-4 inline mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-6 py-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing 1 to {filteredRequests.length} of{" "}
              {verificationRequests.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Previous
              </button>
              <button className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                2
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default VerificationManagement;
