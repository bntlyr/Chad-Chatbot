'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, setDoc, doc } from '@/firebase/firebaseConfig'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'

type Circle = {
  left: string;
  top: string;
  size: number;
}

export default function MobileAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [currentView, setCurrentView] = useState<'welcome' | 'signin' | 'signup'>('welcome')
  const [circles, setCircles] = useState<Circle[]>([])

  const router = useRouter();

  useEffect(() => {
    setCircles(Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 80 + 20,
    })));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.push('./chatbot');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          gender,
        });

        console.log('User created:', user);
        router.push('./chatbot');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', email);
        router.push('./chatbot');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    }
  }

  const renderWelcomeView = () => (
    <div className="flex flex-col items-center justify-center space-y-8 px-4">
      <motion.div
        className="w-24 h-24 md:w-32 md:h-32 relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%201-hd72eYXJKGC3U18c5jQ2QNb2tRTynF.svg"
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Welcome to CHAD</h1>
        <p className="text-white/80">Your AI companion for healing and growth</p>
      </div>
      <div className="w-full space-y-4 mt-8">
        <Button className="w-full h-12 text-lg bg-white text-primary hover:bg-white/90" onClick={() => setCurrentView('signin')}>Sign In</Button>
        <Button variant="outline" className="w-full h-12 text-lg bg-transparent border-white text-white hover:bg-white/20" onClick={() => setCurrentView('signup')}>Create Account</Button>
      </div>
    </div>
  )

  const renderAuthForm = (isSignUp: boolean) => (
    <form onSubmit={(e) => handleEmailAuth(e, isSignUp)} className="space-y-6 bg-white/10 backdrop-blur-md p-6 rounded-lg w-full max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="p-0 mr-4 text-white" onClick={() => setCurrentView('welcome')}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-white">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
      </div>
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-white">Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="h-12 text-lg bg-white/20 border-white/30 text-white placeholder-white/50" 
            required 
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-white">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="h-12 text-lg bg-white/20 border-white/30 text-white placeholder-white/50" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="h-12 text-lg pr-10 bg-white/20 border-white/30 text-white placeholder-white/50" 
            required 
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isSignUp && (
        <>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-white">Confirm Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="h-12 text-lg bg-white/20 border-white/30 text-white placeholder-white/50" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium text-white">Gender</Label>
            <Select onValueChange={setGender} required>
              <SelectTrigger className="h-12 text-lg bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      <Button type="submit" className="w-full h-12 text-lg bg-white text-primary hover:bg-white/90">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
    </form>
  )

  return (
    <div className="relative min-h-screen bg-primary text-white flex flex-col justify-center items-center px-4 py-16 overflow-hidden">
      {circles.map((circle, index) => (
        <motion.div
          key={index}
          style={{
            left: circle.left,
            top: circle.top,
            width: circle.size,
            height: circle.size,
          }}
          className="absolute rounded-full bg-white/20 animate-pulse"
        />
      ))}
      <div className="z-10 w-full max-w-md">
        {currentView === 'welcome' && renderWelcomeView()}
        {currentView === 'signin' && renderAuthForm(false)}
        {currentView === 'signup' && renderAuthForm(true)}
      </div>
    </div>
  );
}