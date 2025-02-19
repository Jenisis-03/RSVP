"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { submitRSVP } from "../actions/submitRSVP";
import { strings } from "../utils/Strings";

// Helper Component: Form Field with Label and Error Handling
const FormField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  error,
  min,
}: {
  id: string;
  label: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  min?: number;
}) => (
  <div className="mb-4">
    <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      required
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const RSVPForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    accompany: null as string | null,
    attendence: "yes",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter

  // Validation Logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("accompany", formData.accompany || "0");
    formDataToSend.append("attendence", formData.attendence);

    try {
      const response = await submitRSVP(formDataToSend);
      if (response.success) {
        toast({
          title: "Success",
          description: strings.thankYouMessage,
          duration: 3000,
        });
        setFormData({ name: "", email: "", accompany: null, attendence: "yes" });
        setErrors({});
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        if (response.error?.code === "23505") {
          setErrors({ email: "Email already exists or You have already registered!" });
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open Google Maps
  const openGoogleMaps = () => {
    const encodedLocation = encodeURIComponent(strings.eventLocation);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      "_blank"
    );
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        {strings.title}
      </h1>
      <p className="text-center text-gray-600 mb-8">{strings.description}</p>

      {/* Event Date and Location */}
      <div className="mb-8 text-center">
        <Label className="block text-lg font-semibold text-gray-700 mb-2">
          {strings.eventDateLabel}
        </Label>
        <Calendar
          mode="single"
          selected={new Date(strings.eventDate)}
          className="rounded-md border mx-auto w-full max-w-xs"
          fromDate={new Date(strings.eventDate)}
          toDate={new Date(strings.eventDate)}
          defaultMonth={new Date(strings.eventDate)}
          ISOWeek
        />
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          onClick={openGoogleMaps}
        >
          <MapPin className="mr-2" />
          {strings.viewOnMapButton}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="name"
          label={strings.nameLabel}
          value={formData.name}
          onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
          error={errors.name}
        />
        <FormField
          id="email"
          label={strings.emailLabel}
          value={formData.email}
          onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
          error={errors.email}
        />
        <FormField
          id="accompany"
          label={strings.accompanyLabel}
          value={formData.accompany}
          onChange={(value) => setFormData((prev) => ({ ...prev, accompany: value }))}
          type="number"
          min={0}
        />
        <div>
          <Label className="block text-lg font-semibold text-gray-700 mb-2">
            {strings.rsvpLabel}
          </Label>
          <RadioGroup
            value={formData.attendence}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, attendence: value }))
            }
            className="flex justify-center space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="text-gray-700">
                {strings.yesOption}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="text-gray-700">
                {strings.noOption}
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          {isLoading ? "Sending..." : "SUBMIT"}
        </Button>
      </form>

      {/* Admin Button */}
      <div className="mt-6 text-center">
        <Button
          variant="secondary"
          className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          onClick={() => router.push("/login")} // Navigate to /admin/login
        >
          Admin Panel
        </Button>
      </div>
    </div>
  );
};

export default RSVPForm;