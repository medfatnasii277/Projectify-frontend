import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState(location.state?.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.verifyEmail({ email, verificationCode });
      toast({
        title: 'Email verified!',
        description: 'Your email has been successfully verified.',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify email. Please check your code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      await authService.resendVerification(email);
      toast({
        title: 'Code sent!',
        description: 'A new verification code has been sent to your email.',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Mail className="h-16 w-16 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            We sent a 6-digit code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                name="verificationCode"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                required
                disabled={isLoading}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-gray-500 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || verificationCode.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend'}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
