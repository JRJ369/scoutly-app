import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CapturePhotoStep } from './steps/CapturePhotoStep';
import { ConfirmLocationStep } from './steps/ConfirmLocationStep';
import { SelectSignalsStep } from './steps/SelectSignalsStep';
import { AddNotesStep } from './steps/AddNotesStep';
import { ReviewStep } from './steps/ReviewStep';
import { SuccessStep } from './steps/SuccessStep';

export interface SubmissionData {
  photo: string | null;
  photoFile: File | null;
  latitude: number | null;
  longitude: number | null;
  contractorSignals: string[];
  realEstateSignals: string[];
  occupancyStatus: string;
  notes: string;
}

export function SubmitPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submissionId, setSubmissionId] = useState('');
  const [data, setData] = useState<SubmissionData>({
    photo: null,
    photoFile: null,
    latitude: null,
    longitude: null,
    contractorSignals: [],
    realEstateSignals: [],
    occupancyStatus: '',
    notes: '',
  });

  const updateData = (updates: Partial<SubmissionData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    if (!user || !data.photoFile) return;

    const fileName = `${user.id}/${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(fileName, data.photoFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('submissions')
      .getPublicUrl(fileName);

    const { data: submission, error: insertError } = await supabase
      .from('submissions')
      .insert({
        user_id: user.id,
        photo_url: publicUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        contractor_signals: data.contractorSignals,
        realestate_signals: data.realEstateSignals,
        occupancy_status: data.occupancyStatus,
        notes: data.notes,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    setSubmissionId(submission.id);
    setStep(6);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleReset = () => {
    setData({
      photo: null,
      photoFile: null,
      latitude: null,
      longitude: null,
      contractorSignals: [],
      realEstateSignals: [],
      occupancyStatus: '',
      notes: '',
    });
    setStep(1);
  };

  if (step === 1) {
    return (
      <CapturePhotoStep
        data={data}
        updateData={updateData}
        onNext={() => setStep(2)}
        onCancel={handleCancel}
      />
    );
  }

  if (step === 2) {
    return (
      <ConfirmLocationStep
        data={data}
        updateData={updateData}
        onNext={() => setStep(3)}
        onBack={() => setStep(1)}
      />
    );
  }

  if (step === 3) {
    return (
      <SelectSignalsStep
        data={data}
        updateData={updateData}
        onNext={() => setStep(4)}
        onBack={() => setStep(2)}
      />
    );
  }

  if (step === 4) {
    return (
      <AddNotesStep
        data={data}
        updateData={updateData}
        onNext={() => setStep(5)}
        onBack={() => setStep(3)}
      />
    );
  }

  if (step === 5) {
    return (
      <ReviewStep
        data={data}
        onSubmit={handleSubmit}
        onBack={() => setStep(4)}
      />
    );
  }

  if (step === 6) {
    return (
      <SuccessStep
        submissionId={submissionId}
        onHome={() => navigate('/')}
        onSubmitAnother={handleReset}
      />
    );
  }

  return null;
}
