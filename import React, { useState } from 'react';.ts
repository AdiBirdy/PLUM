import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, FileText, Upload, Download, Trash2 } from 'lucide-react';

const OnCallTrendsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [storedDocuments, setStoredDocuments] = useState([]);
  const [uploadedReports, setUploadedReports] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const weeklyData = [
    { week: 'Week 1', incoming: 67, solved: 44, open: 81, invalid: 7, resolutionRate: 35.2, invalidRate: 10.4 },
    { week: 'Week 2', incoming: 87, solved: 35, open: 70, invalid: 14, resolutionRate: 33.3, invalidRate: 16.1 },
    { week: 'Week 3', incoming: 47, solved: 67, open: 59, invalid: 23, resolutionRate: 53.2, invalidRate: 48.9 },
    { week: 'Week 4', incoming: 71, solved: 72, open: 65, invalid: 13, resolutionRate: 52.6, invalidRate: 18.3 },
    { week: 'Week 5', incoming: 62, solved: 46, open: 76, invalid: 16, resolutionRate: 37.7, invalidRate: 25.8 },
    { week: 'Week 6', incoming: 73, solved: 81, open: 44, invalid: 28, resolutionRate: 64.8, invalidRate: 38.4 }
  ];

  const issueCategories = [
    { name: 'CD Balance Problems', count: 8, severity: 'high', pod: 'Admin' },
    { name: 'Payment/Bank Issues', count: 7, severity: 'high', pod: 'Employee' },
    { name: 'Phone Number Issues', count: 6, severity: 'medium', pod: 'Admin' },
    { name: 'Document Processing', count: 5, severity: 'medium', pod: 'Employee' },
    { name: 'Trinity Batch Issues', count: 4, severity: 'medium', pod: 'Admin' },
    { name: 'Dashboard Access', count: 3, severity: 'low', pod: 'Admin' }
  ];

  const agingData = [
    { week: 'Week 1', admin: 4, employee: 5 },
    { week: 'Week 2', admin: 7, employee: 5 },
    { week: 'Week 3', admin: 7, employee: 5 },
    { week: 'Week 4', admin: 10, employee: 3 },
    { week: 'Week 5', admin: 10, employee: 3 },
    { week: 'Week 6', admin: 13, employee: 2 }
  ];

  const podComparison = [
    { pod: 'Admin Pod', avgIncoming: 43.5, avgResolutionRate: 43.2, avgInvalidRate: 21.8 },
    { pod: 'Employee Pod', avgIncoming: 24.3, avgResolutionRate: 48.0, avgInvalidRate: 3.2 }
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    files.forEach(file => {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newReport = {
            id: Date.now() + Math.random(),
            name: file.name,
            uploadDate: new Date().toISOString(),
            size: file.size,
            type: 'PDF Report',
            content: e.target.result,
            week: `Week ${uploadedReports.length + 1}`,
            status: 'Processed'
          };
          setUploadedReports(prev => [...prev, newReport]);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }
    });
    event.target.value = '';
  };

  const generateAnalysisReport = () => {
    const analysisDoc = {
      id: Date.now(),
      name: `Trend Analysis Report - ${new Date().toLocaleDateString()}`,
      uploadDate: new Date().toISOString(),
      type: 'Analysis Report',
      content: {
        summary: {
          avgResolutionRate: '46.1%',
          avgInvalidRate: '26.3%',
          totalTickets: 407,
          criticalIssues: 6
        },
        recommendations: [
          'Implement CD balance sync monitoring',
          'Create self-service portal for common requests',
          'Enable mobile app phone number updates',
          'Optimize document processing pipeline'
        ],
        trends: weeklyData
      },
      status: 'Generated'
    };
    setStoredDocuments(prev => [...prev, analysisDoc]);
  };

  const deleteDocument = (id, isReport = false) => {
    if (isReport) {
      setUploadedReports(prev => prev.filter(doc => doc.id !== id));
    } else {
      setStoredDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const exportData = () => {
    const dataToExport = {
      weeklyTrends: weeklyData,
      issueCategories: issueCategories,
      agingData: agingData,
      documents: storedDocuments,
      reports: uploadedReports,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `oncall-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-1 ${change > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(change)}%
            </p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Avg Weekly Tickets" 
          value="67.8" 
          change={8.2}
          icon={AlertTriangle} 
          color="text-blue-600" 
        />
        <StatCard 
          title="Avg Resolution Rate" 
          value="46.1%" 
          change={-5.3}
          icon={CheckCircle} 
          color="text-green-600" 
        />
        <StatCard 
          title="Invalid Ticket Rate" 
          value="26.3%" 
          change={12.7}
          icon={Target} 
          color="text-red-600" 
        />
        <StatCard 
          title="Aging Tickets" 
          value="15" 
          change={8.9}
          icon={Clock} 
          color="text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Weekly Ticket Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="incoming" stackId="1" stroke="#3B82F6" fill="#93C5FD" />
              <Area type="monotone" dataKey="solved" stackId="2" stroke="#10B981" fill="#86EFAC" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Resolution Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="resolutionRate" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="invalidRate" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderIssues = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Top Recurring Issues</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={issueCategories} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Issue Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pod</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Required</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issueCategories.map((issue, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.pod}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                      issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {issue.severity === 'high' ? 'Immediate Fix' : 
                     issue.severity === 'medium' ? 'Next Sprint' : 'Backlog'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Pod Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={podComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pod" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgResolutionRate" fill="#3B82F6" name="Resolution Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Aging Tickets Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={agingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="admin" stroke="#EF4444" strokeWidth={2} name="Admin Pod" />
              <Line type="monotone" dataKey="employee" stroke="#3B82F6" strokeWidth={2} name="Employee Pod" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Key Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">🎯 Strengths</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Employee Pod maintains consistent resolution rates</li>
              <li>• Week 6 showed significant improvement (64.8% resolution)</li>
              <li>• Strong RCA documentation and learning</li>
              <li>• Effective permanent fix implementation</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">⚠️ Areas for Improvement</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Admin Pod aging tickets increasing (4→13)</li>
              <li>• High invalid ticket rate (26.3% average)</li>
              <li>• Recurring CD balance issues need systematic fix</li>
              <li>• Phone number update flow needs automation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Upload Oncall Reports</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload PDF Reports
                </span>
                <span className="text-sm text-gray-500">
                  Drag and drop or click to select files
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            {isUploading && (
              <div className="mt-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-1">Processing...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Analysis Actions</h3>
        <div className="flex space-x-4">
          <button
            onClick={generateAnalysisReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Analysis Report
          </button>
          <button
            onClick={exportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Uploaded Reports ({uploadedReports.length})</h3>
        <div className="space-y-4">
          {uploadedReports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reports uploaded yet. Upload PDF files to get started.</p>
          ) : (
            uploadedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">
                      {report.week} • {new Date(report.uploadDate).toLocaleDateString()} • {Math.round(report.size / 1024)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {report.status}
                  </span>
                  <button
                    onClick={() => deleteDocument(report.id, true)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Generated Analysis Documents ({storedDocuments.length})</h3>
        <div className="space-y-4">
          {storedDocuments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No analysis documents generated yet. Click "Generate Analysis Report" to create one.</p>
          ) : (
            storedDocuments.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.uploadDate).toLocaleDateString()} • {doc.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {doc.status}
                    </span>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Resolution Rate:</span>
                      <span className="ml-1 font-medium">{doc.content.summary.avgResolutionRate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Invalid Rate:</span>
                      <span className="ml-1 font-medium">{doc.content.summary.avgInvalidRate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Tickets:</span>
                      <span className="ml-1 font-medium">{doc.content.summary.totalTickets}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Critical Issues:</span>
                      <span className="ml-1 font-medium">{doc.content.summary.criticalIssues}</span>
                    </div>
                  </div>
                  
                  <h5 className="font-medium text-gray-900 mt-4 mb-2">Top Recommendations</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {doc.content.recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb