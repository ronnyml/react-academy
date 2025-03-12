import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/useAuth";
import { LoginData } from "@/types/authTypes";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginData) => loginUser(data),
    onSuccess: (data) => {
      if (data.success) {
        const { token, user } = data.data;
        if (token && user) {
          login(token, user);
          navigate("/dashboard");
        } else {
          setError("Invalid response format. Please try again.");
        }
      } else {
        setError(data.message || "Invalid email or password. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials and try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const loginData: LoginData = { email, password };
    mutate(loginData);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">React Academy</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-blue-600">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-blue-600">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;