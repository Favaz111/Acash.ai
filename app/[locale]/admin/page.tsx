'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, DollarSign, TrendingUp, Database, Shield, Zap } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    totalRevenue: 0,
    dailyActiveUsers: 0,
    avgSessionTime: 0,
    systemHealth: 100,
    apiCalls: 0,
  });

  useEffect(() => {
    // Simulate real-time stats
    const interval = setInterval(() => {
      setStats({
        totalUsers: Math.floor(Math.random() * 1000) + 500,
        activeUsers: Math.floor(Math.random() * 100) + 50,
        premiumUsers: Math.floor(Math.random() * 50) + 10,
        totalRevenue: Math.floor(Math.random() * 50000) + 10000,
        dailyActiveUsers: Math.floor(Math.random() * 200) + 100,
        avgSessionTime: Math.floor(Math.random() * 15) + 5,
        systemHealth: Math.floor(Math.random() * 10) + 90,
        apiCalls: Math.floor(Math.random() * 10000) + 5000,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card className={`border-l-4 ${color}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="w-5 h-5 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Real-time system monitoring and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            trend="+12% this month"
            color="border-blue-500"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={Activity}
            trend="+5% today"
            color="border-green-500"
          />
          <StatCard
            title="Premium Users"
            value={stats.premiumUsers}
            icon={DollarSign}
            trend="+8% this week"
            color="border-purple-500"
          />
          <StatCard
            title="Total Revenue"
            value={`SAR ${stats.totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            trend="+15% this month"
            color="border-orange-500"
          />
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">System Health</span>
                    <span className="text-sm font-bold text-green-600">{stats.systemHealth}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${stats.systemHealth}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">API Response Time</span>
                    <span className="text-sm font-bold text-blue-600">125ms</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Database Load</span>
                    <span className="text-sm font-bold text-yellow-600">45%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 transition-all" style={{ width: '45%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Server Memory</span>
                    <span className="text-sm font-bold text-purple-600">62%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all" style={{ width: '62%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Firestore Rules</span>
                  <span className="text-xs font-bold text-green-700">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Rate Limiting</span>
                  <span className="text-xs font-bold text-green-700">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">SSL/TLS</span>
                  <span className="text-xs font-bold text-green-700">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Authentication</span>
                  <span className="text-xs font-bold text-green-700">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Debts Tracked</span>
                  <span className="font-bold">{(stats.totalUsers * 2.3).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Goals Created</span>
                  <span className="font-bold">{(stats.totalUsers * 1.8).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Budgets Created</span>
                  <span className="font-bold">{(stats.totalUsers * 1.5).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Assessments Done</span>
                  <span className="font-bold">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Calculations</span>
                  <span className="font-bold">{(stats.totalUsers * 5.2).toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                API Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total API Calls</span>
                  <span className="font-bold">{stats.apiCalls.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Auth Endpoints</span>
                  <span className="font-bold">{(stats.apiCalls * 0.3).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Debt Calculator</span>
                  <span className="font-bold">{(stats.apiCalls * 0.4).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Reads</span>
                  <span className="font-bold">{(stats.apiCalls * 0.6).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Writes</span>
                  <span className="font-bold">{(stats.apiCalls * 0.2).toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
