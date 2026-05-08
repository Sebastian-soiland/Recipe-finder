import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Send to backend
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
        toast.success("Message sent! We'll get back to you soon.");
        
        // Reset form after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Error sending message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-mint-200 border-2 border-black/20 p-6 text-center">
        <CheckCircle className="w-12 h-12 text-black mx-auto mb-4" />
        <h3 className="text-xl font-black text-black mb-2">THANK YOU!</h3>
        <p className="text-black font-semibold">
          We've received your message and will respond soon.
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 border-2 border-black/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-6 h-6 text-black" />
        <h3 className="text-xl font-black text-black">CONTACT US</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            NAME
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="border-2 border-black/20 focus:border-black/40 rounded-lg"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-2">
            EMAIL
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="border-2 border-black/20 focus:border-black/40 rounded-lg"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-2">
            MESSAGE
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message..."
            rows={4}
            className="w-full border-2 border-black/20 focus:border-black/40 rounded-lg p-3 font-sans text-black placeholder-gray-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-lilac-200 hover:bg-lilac-300 text-black font-black border-2 border-black/20 rounded-lg py-3 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isLoading ? "SENDING..." : "SEND MESSAGE"}
        </Button>
      </form>

      <p className="text-xs text-gray-600 mt-4 text-center">
        We'll respond to Sebastian.soiland@gmail.com
      </p>
    </Card>
  );
};

export default ContactForm;
