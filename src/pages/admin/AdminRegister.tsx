import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { useState } from "react";
import { registerSchema, type RegisterFormData } from "../../schemas/auth";

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register, isRegistering, registerError } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee", // Default to employee role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      registerSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);

      // Show success message and redirect to admin dashboard or users list
      alert(
        `User ${formData.firstName} ${formData.lastName} registered successfully!`
      );

      // Reset form for next registration
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "employee",
      });

      // Or navigate to users management page
      // navigate("/admin/users");
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Error is handled by the useAuth hook
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Register New User
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create a new employee or customer account
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Role Selection - Always visible for admin */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm/6 font-medium text-gray-900"
            >
              User Role
            </label>
            <div className="mt-2">
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleInputChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  validationErrors.role ? "border-red-500" : ""
                }`}
              >
                <option value="employee">Employee</option>
                <option value="customer">Customer</option>
              </select>
              {validationErrors.role && (
                <p className="mt-2 text-sm text-red-600">
                  {validationErrors.role}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm/6 font-medium text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                    validationErrors.firstName ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.firstName && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.firstName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                    validationErrors.lastName ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.lastName && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  validationErrors.email ? "border-red-500" : ""
                }`}
              />
              {validationErrors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {validationErrors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  validationErrors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-sm text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {validationErrors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {validationErrors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Confirm password
            </label>
            <div className="mt-2 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  validationErrors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-sm text-gray-400"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
              {validationErrors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isRegistering}
              className="flex-1 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? "Creating user..." : "Create User"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 flex justify-center rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          {registerError && (
            <p className="mt-2 text-sm text-red-600 text-center">
              {(registerError as any)?.message ||
                "Registration failed. Please try again."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
