import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AddUpdateStudentCertificate } from '@/api/studentServices'; // Import the API service

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification?: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    certificationId?: string;
    certificateUrl?: string;
  };
  onUpdateSuccess?: () => void; // Add callback for successful update
}

export const CertificationModal: React.FC<CertificationModalProps> = ({
  isOpen,
  onClose,
  certification,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    id: certification?.id || '0',
    name: certification?.name || '',
    issuer: certification?.issuer || '',
    date: certification?.date || '',
    certificationId: certification?.certificationId || '',
    certificateUrl: certification?.certificateUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the data for API submission
      const submissionData = {
        id: parseInt(formData.id),
        certificationName: formData.name,
        issuedBy: formData.issuer,
        issueDate: formData.date,
        certificationId: formData.certificationId || null,
        certificateUrl: formData.certificateUrl || null,
      };

      // Call the API service
      const response = await AddUpdateStudentCertificate(submissionData);
      
      if (response.success) {
        // Show success message
        toast.success(certification ? 'Certification updated successfully!' : 'Certification added successfully!');
        
        // Close the modal
        onClose();
        
        // Trigger parent component refresh if callback is provided
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        // Show error message
        toast.error(response.message || 'Failed to save certification details');
      }
    } catch (error: any) {
      console.error('Error saving certification:', error);
      toast.error(error.response?.data?.Message || 'An error occurred while saving certification details');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: certification?.id || '0',
        name: certification?.name || '',
        issuer: certification?.issuer || '',
        date: certification?.date || '',
        certificationId: certification?.certificationId || '',
        certificateUrl: certification?.certificateUrl || '',
      });
    }
  }, [isOpen, certification]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {certification ? 'Edit Certification' : 'Add Certification'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Certification Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., AWS Certified Developer"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuing Organization</Label>
            <Input
              id="issuer"
              value={formData.issuer}
              onChange={(e) => handleInputChange('issuer', e.target.value)}
              placeholder="e.g., Amazon Web Services"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="certificationId">Certification ID (Optional)</Label>
            <Input
              id="certificationId"
              value={formData.certificationId}
              onChange={(e) => handleInputChange('certificationId', e.target.value)}
              placeholder="e.g., AWS-CERT-DEV-ASSOC"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Issue Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="certificateUrl">Certificate URL (Optional)</Label>
            <Input
              id="certificateUrl"
              type="url"
              value={formData.certificateUrl}
              onChange={(e) => handleInputChange('certificateUrl', e.target.value)}
              placeholder="https://example.com/certificate"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (certification ? 'Update' : 'Add')} Certification
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};