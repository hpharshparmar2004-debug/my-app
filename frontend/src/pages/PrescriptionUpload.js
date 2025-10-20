import { useState } from 'react';
import { Upload, FileText, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PrescriptionUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
      toast.success('Prescription selected');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    // In a real app, this would upload to server
    setUploading(true);
    setTimeout(() => {
      toast.success('Prescription uploaded! Our team will contact you soon.');
      setFile(null);
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-12" data-testid="prescription-upload-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-10 h-10" />
              <h1 className="text-3xl font-bold">Upload Prescription</h1>
            </div>
            <p className="text-green-50">
              Upload your prescription and we'll help you order the medicines you need
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="prescription-form">
              {/* Upload Area */}
              <div>
                <label
                  htmlFor="prescription-file"
                  className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:bg-gray-50 transition-colors"
                  data-testid="prescription-upload-area"
                >
                  <Upload className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    {file ? file.name : 'Click to upload prescription'}
                  </p>
                  <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                </label>
                <input
                  id="prescription-file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="prescription-file-input"
                />
              </div>

              <Button
                type="submit"
                disabled={!file || uploading}
                className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                data-testid="submit-prescription-button"
              >
                {uploading ? 'Uploading...' : 'Upload Prescription'}
              </Button>
            </form>

            {/* Instructions */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-bold">How it works:</h3>
              <ol className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 font-semibold text-sm">
                    1
                  </span>
                  Upload a clear photo or scan of your prescription
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 font-semibold text-sm">
                    2
                  </span>
                  Our pharmacist will verify your prescription
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 font-semibold text-sm">
                    3
                  </span>
                  We'll contact you with available medicines and pricing
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 font-semibold text-sm">
                    4
                  </span>
                  Place your order and get it delivered to your doorstep
                </li>
              </ol>
            </div>

            {/* Alternative Contact */}
            <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
              <h3 className="font-bold mb-3">Prefer to order via phone?</h3>
              <p className="text-sm text-gray-600 mb-4">
                You can also send your prescription and place orders through WhatsApp or call us directly
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  data-testid="whatsapp-order-button"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  data-testid="call-order-button"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpload;
