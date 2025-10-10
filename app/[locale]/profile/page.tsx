'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Crown,
  Edit,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUser } from '@/lib/firebase/db';
import { updateProfile } from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { User } from '@/types/database';
import { SkeletonCard, Skeleton } from '@/components/ui/skeleton';
import { showSuccess, showError } from '@/components/ui/toast';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editedName, setEditedName] = useState('');

  // جلب بيانات المستخدم من Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUser(authUser.uid);
        setUserData(data);
        setEditedName(data?.displayName || authUser.displayName || '');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('فشل في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchUserData();
    }
  }, [authUser]);

  // توجيه للـ Login إذا لم يكن مسجل دخول
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [authUser, authLoading, router]);

  const handleSave = async () => {
    const auth = getAuthInstance();
    if (!authUser || !auth.currentUser) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // تحديث الاسم في Firebase Auth
      await updateProfile(auth.currentUser, {
        displayName: editedName,
      });

      setSuccess('تم تحديث الملف الشخصي بنجاح');
      setEditing(false);
      showSuccess('تم تحديث الملف الشخصي بنجاح');

      // تحديث البيانات المحلية
      if (userData) {
        setUserData({ ...userData, displayName: editedName });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحديث البيانات';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Skeleton className="w-64 h-8 mb-2" />
            <Skeleton className="w-96 h-5" />
          </div>
          <div className="grid gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  // Phase One: All users are free tier
  const subscriptionTier = 'free';
  const subscriptionStatus = 'active';
  const createdAt = userData?.createdAt || new Date();
  const lastLoginAt = userData?.lastLoginAt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
          <p className="text-gray-600">إدارة معلوماتك الشخصية واشتراكك</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>المعلومات الشخصية</CardTitle>
                {!editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-trust to-primary-innovation flex items-center justify-center text-white text-3xl font-bold">
                    {authUser.displayName?.charAt(0) || authUser.email?.charAt(0) || 'U'}
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {authUser.displayName || 'مستخدم'}
                  </h3>
                  <p className="text-sm text-gray-600">{authUser.email}</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                {editing ? (
                  <Input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{authUser.displayName || 'غير محدد'}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{authUser.email}</span>
                  {authUser.emailVerified && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-auto" />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      'حفظ التغييرات'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setEditedName(authUser.displayName || '');
                      setError('');
                    }}
                    disabled={saving}
                  >
                    إلغاء
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown
                  className={`w-5 h-5 ${subscriptionTier === 'free' ? 'text-gray-400' : 'text-yellow-500'}`}
                />
                الاشتراك
              </CardTitle>
              <CardDescription>معلومات خطة الاشتراك الحالية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">الخطة الحالية</p>
                  <p className="text-lg font-semibold text-gray-900">مجانية</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subscriptionStatus === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {subscriptionStatus === 'active' ? 'نشط' : 'منتهي'}
                </div>
              </div>

              {/* Phase One: No upgrade option */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  النسخة المميزة قريباً - ابقَ على اطلاع!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الحساب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">تاريخ الإنشاء</span>
                </div>
                <span className="text-sm text-gray-900">{createdAt.toLocaleDateString('ar')}</span>
              </div>

              {lastLoginAt && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm">آخر تسجيل دخول</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {lastLoginAt.toLocaleDateString('ar')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">حالة التحقق</span>
                </div>
                <span
                  className={`text-sm ${authUser.emailVerified ? 'text-green-600' : 'text-orange-600'}`}
                >
                  {authUser.emailVerified ? 'تم التحقق' : 'لم يتم التحقق'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
