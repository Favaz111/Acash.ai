'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import {
  Lock,
  Mail,
  Trash2,
  Globe,
  Bell,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccess, showError, showWarning } from '@/components/ui/toast';

export default function SettingsPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/auth/login?redirect=/settings');
    }
  }, [authUser, authLoading, router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuthInstance();
    if (!auth.currentUser || !authUser?.email) return;

    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      const errorMsg = 'كلمتا المرور غير متطابقتين';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    if (newPassword.length < 6) {
      const errorMsg = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    setChangingPassword(true);

    try {
      // إعادة المصادقة أولاً
      const credential = EmailAuthProvider.credential(authUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // تحديث كلمة المرور
      await updatePassword(auth.currentUser, newPassword);

      const successMsg = 'تم تغيير كلمة المرور بنجاح';
      setSuccess(successMsg);
      showSuccess(successMsg);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      let errorMsg = 'فشل في تغيير كلمة المرور';
      if (err instanceof Error) {
        if (err.message.includes('wrong-password')) {
          errorMsg = 'كلمة المرور الحالية غير صحيحة';
        }
      }
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuthInstance();
    if (!auth.currentUser || !authUser?.email) return;

    setError('');
    setSuccess('');

    if (!newEmail || !newEmail.includes('@')) {
      const errorMsg = 'البريد الإلكتروني غير صحيح';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    setChangingEmail(true);

    try {
      // إعادة المصادقة
      const credential = EmailAuthProvider.credential(authUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // تحديث البريد
      await updateEmail(auth.currentUser, newEmail);

      const successMsg = 'تم تغيير البريد الإلكتروني بنجاح';
      setSuccess(successMsg);
      showSuccess(successMsg);
      setNewEmail('');
      setCurrentPassword('');
    } catch (err: unknown) {
      let errorMsg = 'فشل في تغيير البريد الإلكتروني';
      if (err instanceof Error) {
        if (err.message.includes('email-already-in-use')) {
          errorMsg = 'هذا البريد مستخدم بالفعل';
        } else if (err.message.includes('wrong-password')) {
          errorMsg = 'كلمة المرور غير صحيحة';
        }
      }
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setChangingEmail(false);
    }
  };

  const handleDeleteAccount = async () => {
    const auth = getAuthInstance();
    if (!auth.currentUser || !authUser?.email) return;
    if (deleteConfirmation !== 'حذف') {
      showWarning('يرجى كتابة "حذف" للتأكيد');
      return;
    }

    setError('');
    setDeleting(true);

    try {
      // إعادة المصادقة
      const credential = EmailAuthProvider.credential(authUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // حذف الحساب
      await deleteUser(auth.currentUser);

      showSuccess('تم حذف الحساب بنجاح');

      // توجيه للصفحة الرئيسية
      setTimeout(() => router.push('/'), 1500);
    } catch (err: unknown) {
      let errorMsg = 'فشل في حذف الحساب';
      if (err instanceof Error) {
        if (err.message.includes('wrong-password')) {
          errorMsg = 'كلمة المرور غير صحيحة';
        }
      }
      setError(errorMsg);
      showError(errorMsg);
      setDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-trust animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
          <p className="text-gray-600">إدارة إعدادات حسابك وتفضيلاتك</p>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid gap-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                تغيير كلمة المرور
              </CardTitle>
              <CardDescription>قم بتحديث كلمة المرور لحسابك</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input
                  label="كلمة المرور الحالية"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={changingPassword}
                />
                <Input
                  label="كلمة المرور الجديدة"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={changingPassword}
                />
                <Input
                  label="تأكيد كلمة المرور الجديدة"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={changingPassword}
                />
                <Button type="submit" disabled={changingPassword}>
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التغيير...
                    </>
                  ) : (
                    'تغيير كلمة المرور'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                تغيير البريد الإلكتروني
              </CardTitle>
              <CardDescription>
                البريد الحالي: <strong>{authUser.email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangeEmail} className="space-y-4">
                <Input
                  label="البريد الإلكتروني الجديد"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  disabled={changingEmail}
                />
                <Input
                  label="كلمة المرور للتأكيد"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={changingEmail}
                />
                <Button type="submit" disabled={changingEmail}>
                  {changingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التغيير...
                    </>
                  ) : (
                    'تغيير البريد'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Language & Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                اللغة والتفضيلات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">اللغة</p>
                  <p className="text-sm text-gray-600">اختر لغة العرض</p>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">إشعارات البريد</p>
                  <p className="text-sm text-gray-600">تلقي التحديثات عبر البريد</p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">التوصيات المالية</p>
                  <p className="text-sm text-gray-600">نصائح وتوصيات أسبوعية</p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                منطقة الخطر
              </CardTitle>
              <CardDescription>إجراءات لا يمكن التراجع عنها</CardDescription>
            </CardHeader>
            <CardContent>
              {!showDeleteDialog ? (
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف الحساب
                </Button>
              ) : (
                <div className="space-y-4 p-4 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 mb-2">هل أنت متأكد من حذف حسابك؟</p>
                      <p className="text-sm text-red-700 mb-4">
                        سيتم حذف جميع بياناتك بشكل دائم ولا يمكن استعادتها.
                      </p>
                    </div>
                  </div>

                  <Input
                    label='اكتب "حذف" للتأكيد'
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    disabled={deleting}
                  />

                  <Input
                    label="كلمة المرور"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={deleting}
                  />

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={handleDeleteAccount}
                      disabled={deleting || deleteConfirmation !== 'حذف'}
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحذف...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 ml-2" />
                          تأكيد الحذف
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteDialog(false);
                        setDeleteConfirmation('');
                        setCurrentPassword('');
                      }}
                      disabled={deleting}
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
