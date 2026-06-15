import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { Settings, ArrowRight } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    return () => { dispatch(clearError()); };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(res)) {
      toast.success("Login successful!");
    } else {
      toast.error(res.payload || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-luxury-gradient selection:bg-brand/30">
      
      {/* Left Branding Side */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden border-r border-border-goldLight">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-light/10 rounded-full blur-[150px]" />
        
        <div className="relative z-10 text-center px-12">
          <div className="w-24 h-24 rounded-2xl bg-gold-gradient mx-auto flex items-center justify-center shadow-gold-btn mb-10 animate-fade-in">
            <Settings size={48} className="text-[#0B0B0B]" />
          </div>
          <h1 className="text-6xl font-bold font-heading gold-text-gradient tracking-tight mb-6 animate-slide-up">
            ConfigUI
          </h1>
          <p className="text-2xl text-text-secondary font-medium animate-slide-up" style={{ animationDelay: '100ms' }}>
            Settings Management System
          </p>
        </div>
      </div>

      {/* Right Auth Side */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md relative z-10">
          <div className="glass-card dark:glass-panel-dark p-10 animate-slide-up">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold font-heading text-text-main tracking-tight">Welcome back</h2>
              <p className="text-text-secondary mt-3 text-sm">Authenticate to access your enterprise dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input 
                  label="Email address"
                  type="email" 
                  required 
                  placeholder="name@company.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Input 
                  label="Password"
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-14 text-base flex items-center justify-center gap-2 group"
                >
                  {loading ? "Authenticating..." : (
                    <>
                      Sign In
                      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-brand hover:text-brand-hover transition-colors">
                  Create one now
                </Link>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
