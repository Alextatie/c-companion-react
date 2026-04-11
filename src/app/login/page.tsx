'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { useGlobalLoading } from '../providers/loading-provider';
import { claimUsername, defaultUsernameFromEmail, getProfileUsername, isUsernameTaken, validateUsername } from '@/lib/username';
import ScaledLessonFrame from '@/components/scaled-lesson-frame';

type AuthStage = 'login' | 'signup';

const SIGNUP_PASSWORD_ERROR_MESSAGE =
  'Password must contain at least 6 characters, upper case letter, and a numeric character.';

const INVALID_LOGIN_CREDENTIAL_CODES = new Set([
  'auth/invalid-credential',
  'auth/wrong-password',
  'auth/user-not-found',
  'auth/invalid-email',
  'auth/user-disabled',
]);

function getLoginErrorMessage(errorCode?: string) {
  return INVALID_LOGIN_CREDENTIAL_CODES.has(errorCode ?? '') ? 'Invalid Credentials' : 'Error. Try again.';
}

function getSignupErrorMessage(errorCode?: string) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Email already taken.';
    case 'auth/invalid-email':
      return 'Invalid e-mail';
    case 'auth/weak-password':
      return SIGNUP_PASSWORD_ERROR_MESSAGE;
    default:
      return 'Error. Try again.';
  }
}

function validateSignupPassword(value: string): string | null {
  if (value.length < 6 || !/[A-Z]/.test(value) || !/\d/.test(value)) {
    return SIGNUP_PASSWORD_ERROR_MESSAGE;
  }
  return null;
}

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, loading] = useAuthState(auth);
  const { setLoading, withLoading } = useGlobalLoading();

  const [authStage, setAuthStage] = useState<AuthStage>('login');
  const [isGoogleFlowPending, setIsGoogleFlowPending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);
  const [isGuestSubmitting, setIsGuestSubmitting] = useState(false);

  useEffect(() => {
    setLoading('landing-auth-state', loading);
    return () => setLoading('landing-auth-state', false);
  }, [loading, setLoading]);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'login') {
      setAuthStage(mode);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user && !isGoogleFlowPending && !isEmailSubmitting && !isGuestSubmitting && !isSignupSubmitting) {
      setIsRedirecting(true);
      router.replace('/Home');
    }
  }, [loading, user, isGoogleFlowPending, isEmailSubmitting, isGuestSubmitting, isSignupSubmitting, router]);

  if (loading || user || isGoogleFlowPending || isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <ScaledLessonFrame baseWidth={1720}>
        <div className="flex h-screen items-center justify-center">
          <div className="flex w-[427px] justify-center">
            <div className="scale-[1.2] w-[305px] overflow-y-auto rounded bg-black/20 p-4 text-center shadow-lg backdrop-blur-[1px]">
              <div className="flex flex-col gap-4">
                {authStage === 'login' ? (
                  <>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);
                        setIsEmailSubmitting(true);
                        try {
                          const credential = await signInWithEmailAndPassword(auth, email, password);
                          const existingDisplayName = await getProfileUsername(credential.user.uid).catch(() => null);
                          if (!existingDisplayName) {
                            const base = defaultUsernameFromEmail(credential.user.email)
                              .replace(/[^a-zA-Z0-9._-]/g, '_')
                              .replace(/^[._-]+|[._-]+$/g, '')
                              .slice(0, 20);
                            const fallbackBase = base.length >= 3 ? base : `user_${credential.user.uid.slice(0, 8)}`;
                            let claimed = false;

                            try {
                              await claimUsername({
                                uid: credential.user.uid,
                                username: fallbackBase,
                              });
                              claimed = true;
                            } catch (err: any) {
                              if (err?.message !== 'Username already taken.') {
                                throw err;
                              }
                            }

                            if (!claimed) {
                              const withSuffix = `${fallbackBase.slice(0, Math.max(0, 17))}_${credential.user.uid.slice(0, 3)}`;
                              await claimUsername({
                                uid: credential.user.uid,
                                username: withSuffix,
                              });
                            }
                          }
                          router.replace('/Home');
                        } catch (err: any) {
                          setError(getLoginErrorMessage(err?.code));
                        } finally {
                          setIsEmailSubmitting(false);
                        }
                      }}
                      className="flex flex-col gap-4"
                    >
                      <label className="-mb-4 text-left text-white text-shadow-lg">Email:</label>
                      <input
                        type="email"
                        placeholder="Email"
                        className="rounded bg-white p-2 text-black shadow-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label className="-mb-4 text-left text-white text-shadow-lg">Password:</label>
                      <input
                        type="password"
                        placeholder="Password"
                        className="rounded bg-white p-2 text-black shadow-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        disabled={isEmailSubmitting}
                        className={`relative rounded bg-[rgb(107,195,95)] py-2 text-xl text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(129,218,133)] ${
                          isEmailSubmitting ? 'cursor-default' : ''
                        }`}
                      >
                        <span className={isEmailSubmitting ? 'opacity-0' : 'opacity-100'}>Log In</span>
                        {isEmailSubmitting ? (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          </span>
                        ) : null}
                      </button>
                    </form>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <p className="text-sm text-white text-shadow-lg">
                      Not a member?{' '}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setError(null);
                          setAuthStage('signup');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setError(null);
                            setAuthStage('signup');
                          }
                        }}
                        className="cursor-pointer align-baseline font-bold"
                      >
                        <span className="drop-shadow-[0_0_1.5px_rgba(0,0,0,0.6)] bg-[linear-gradient(135deg,rgb(130,255,155),rgb(40,223,135))] bg-clip-text text-transparent hover:brightness-[1.15] hover:underline hover:underline-offset-2">
                          Sign up
                        </span>
                      </span>{' '}
                      for free!
                    </p>

                    <div className="-my-2 flex items-center gap-2 text-sm text-white text-shadow-lg">
                      <div className="h-px flex-1 bg-white/60" />
                      <span>Or</span>
                      <div className="h-px flex-1 bg-white/60" />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          setIsGoogleFlowPending(true);
                          try {
                            const credential = await withLoading('landing-google-login', async () =>
                              signInWithPopup(
                                auth,
                                new GoogleAuthProvider().setCustomParameters({
                                  prompt: 'select_account',
                                })
                              )
                            );
                            const existingDisplayName = await getProfileUsername(credential.user.uid).catch(() => null);
                            if (!existingDisplayName) {
                              const base = defaultUsernameFromEmail(credential.user.email)
                                .replace(/[^a-zA-Z0-9._-]/g, '_')
                                .replace(/^[._-]+|[._-]+$/g, '')
                                .slice(0, 20);
                              const fallbackBase = base.length >= 3 ? base : `user_${credential.user.uid.slice(0, 8)}`;
                              let claimed = false;

                              try {
                                await claimUsername({
                                  uid: credential.user.uid,
                                  username: fallbackBase,
                                });
                                claimed = true;
                              } catch (err: any) {
                                if (err?.message !== 'Username already taken.') {
                                  throw err;
                                }
                              }

                              if (!claimed) {
                                const withSuffix = `${fallbackBase.slice(0, Math.max(0, 17))}_${credential.user.uid.slice(0, 3)}`;
                                await claimUsername({
                                  uid: credential.user.uid,
                                  username: withSuffix,
                                });
                              }
                            }
                            router.replace('/Home');
                          } catch (err: any) {
                            if (err?.code === 'auth/popup-closed-by-user') {
                              return;
                            }
                            console.error('Error signing in with Google: ', err);
                          } finally {
                            setIsGoogleFlowPending(false);
                          }
                        }}
                        className="flex w-full items-center justify-center gap-0 rounded bg-[rgb(50,112,159)] py-2 text-center text-s text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(81,133,173)]"
                      >
                        <svg
                          className="mr-0 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="-0.5 0 48 48"
                          version="1.1"
                          aria-hidden="true"
                        >
                          <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Color-" transform="translate(-401.000000, -860.000000)">
                              <g id="Google" transform="translate(401.000000, 860.000000)">
                                <path
                                  d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                                  id="Fill-1"
                                  fill="#FCC937"
                                />
                                <path
                                  d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                                  id="Fill-2"
                                  fill="#EF685D"
                                />
                                <path
                                  d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                                  id="Fill-3"
                                  fill="#5DB975"
                                />
                                <path
                                  d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                                  id="Fill-4"
                                  fill="#679DF6"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                        oogle Login
                      </button>

                      <button
                        onClick={async () => {
                          setError(null);
                          setIsGuestSubmitting(true);
                          try {
                            await signInAnonymously(auth);
                          } catch (err) {
                            console.error('Error signing in as guest: ', err);
                          } finally {
                            setIsGuestSubmitting(false);
                          }
                        }}
                        disabled={isGuestSubmitting}
                        className={`relative w-full rounded bg-[rgb(80,131,180)] py-2 text-center text-s text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(106,150,191)] ${
                          isGuestSubmitting ? 'cursor-default' : ''
                        }`}
                      >
                        <span className={isGuestSubmitting ? 'opacity-0' : 'opacity-100'}>Guest Login</span>
                        {isGuestSubmitting ? (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          </span>
                        ) : null}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);
                        const trimmedUsername = username.trim();
                        const usernameError = validateUsername(trimmedUsername);
                        if (usernameError) {
                          setError(usernameError);
                          return;
                        }
                        const passwordError = validateSignupPassword(password);
                        if (passwordError) {
                          setError(passwordError);
                          return;
                        }
                        setIsSignupSubmitting(true);
                        try {
                          if (await isUsernameTaken(trimmedUsername)) {
                            setError('Username taken');
                            return;
                          }

                          const credential = await createUserWithEmailAndPassword(auth, email, password);
                          try {
                            await claimUsername({
                              uid: credential.user.uid,
                              username: trimmedUsername,
                            });
                          } catch (claimError: any) {
                            await deleteUser(credential.user).catch(() => undefined);
                            if (claimError?.message === 'Username already taken.') {
                              setError('Username taken');
                              return;
                            }
                            throw claimError;
                          }
                          router.replace('/Home');
                        } catch (err: any) {
                          setError(err?.message === 'Username already taken.' ? 'Username taken' : getSignupErrorMessage(err?.code));
                        } finally {
                          setIsSignupSubmitting(false);
                        }
                      }}
                      className="flex flex-col gap-4"
                    >
                      <label className="-mb-4 text-left text-white text-shadow-lg">Username:</label>
                      <input
                        type="text"
                        placeholder="Username"
                        className="rounded bg-white p-2 text-black shadow-lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={20}
                        required
                      />
                      <label className="-mb-4 text-left text-white text-shadow-lg">Email:</label>
                      <input
                        type="email"
                        placeholder="Email"
                        className="rounded bg-white p-2 text-black shadow-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label className="-mb-4 text-left text-white text-shadow-lg">Password:</label>
                      <input
                        type="password"
                        placeholder="Password"
                        className="rounded bg-white p-2 text-black shadow-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSignupSubmitting}
                        className={`relative rounded bg-[rgb(107,195,95)] py-2 text-xl text-white text-shadow-lg shadow-lg transition hover:bg-[rgb(129,218,133)] ${
                          isSignupSubmitting ? 'cursor-default' : ''
                        }`}
                      >
                        <span className={isSignupSubmitting ? 'opacity-0' : 'opacity-100'}>Sign Up</span>
                        {isSignupSubmitting ? (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          </span>
                        ) : null}
                      </button>
                    </form>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <p className="-mb-[4px] text-sm text-white text-shadow-lg">
                      Already a member?{' '}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setError(null);
                          setAuthStage('login');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setError(null);
                            setAuthStage('login');
                          }
                        }}
                        className="cursor-pointer align-baseline font-bold"
                      >
                        <span className="drop-shadow-[0_0_1.5px_rgba(0,0,0,0.6)] bg-[linear-gradient(135deg,rgb(130,255,155),rgb(40,223,135))] bg-clip-text text-transparent hover:brightness-[1.15] hover:underline hover:underline-offset-2">
                          Log in
                        </span>
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </ScaledLessonFrame>
    </div>
  );
};

export default LoginPage;
