import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, HeartPulse, ShieldAlert, Pill, Edit2, Check, Plus, X, Notebook, Shield, PhoneCall } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const addItem = (field: 'existingConditions' | 'allergies' | 'medications', value: string) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
  };

  const removeItem = (field: 'existingConditions' | 'allergies' | 'medications', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="saas-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Personal Health Profile</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile.name || 'Alex Morgan'} • {profile.age || 32} yrs • {profile.gender || 'Male'} • Blood Type {profile.bloodType || 'A+'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else {
                setFormData(profile);
                setIsEditing(true);
              }
            }}
            className="btn-secondary text-xs px-4 py-2"
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Personal Health Context Banner */}
        <div className="bg-indigo-950/60 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-indigo-200">
          <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white mb-0.5">Personal Health Context</p>
            <p className="text-indigo-200/90 leading-relaxed">
              Aura uses your saved health information to personalize conversations and health guidance.
            </p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6 pt-2">
            {/* Section 1: Personal Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Blood Type</label>
                  <input
                    type="text"
                    value={formData.bloodType || 'A+'}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Existing Conditions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
                2. Existing Conditions
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Mild Asthma, Hypertension"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    addItem('existingConditions', newCondition);
                    setNewCondition('');
                  }}
                  className="btn-secondary text-xs px-3"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.existingConditions.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg text-xs">
                    {c}
                    <button type="button" onClick={() => removeItem('existingConditions', i)} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Section 3: Allergies */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                3. Allergies
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    addItem('allergies', newAllergy);
                    setNewAllergy('');
                  }}
                  className="btn-secondary text-xs px-3"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold">
                    {a}
                    <button type="button" onClick={() => removeItem('allergies', i)} className="text-amber-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Section 4: Current Medications */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-indigo-400" />
                4. Current Medications
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Amoxicillin 500mg, Vitamin D3"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    addItem('medications', newMedication);
                    setNewMedication('');
                  }}
                  className="btn-secondary text-xs px-3"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.medications.map((m, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold">
                    {m}
                    <button type="button" onClick={() => removeItem('medications', i)} className="text-indigo-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Section 5: Health Preferences */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Notebook className="w-3.5 h-3.5 text-slate-400" />
                5. Health Preferences & Notes
              </h3>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="Special medical instructions or dietary preferences..."
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs px-5 py-2">
                <Check className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="space-y-6 pt-2">
            {/* Personal Info Grid */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Personal Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Full Name</span>
                  <span className="font-bold text-white">{profile.name || 'Alex Morgan'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Age</span>
                  <span className="font-bold text-white">{profile.age || 32} yrs</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Gender</span>
                  <span className="font-bold text-white">{profile.gender || 'Male'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Blood Type</span>
                  <span className="font-bold text-white">{profile.bloodType || 'A+'}</span>
                </div>
              </div>
            </div>

            {/* Conditions & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
                  2. Existing Conditions
                </h3>
                {profile.existingConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.existingConditions.map((c, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-200 rounded-lg text-xs font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">None reported</p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  3. Allergies
                </h3>
                {profile.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.allergies.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold">
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No allergies listed</p>
                )}
              </div>
            </div>

            {/* Medications & Health Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-indigo-400" />
                  4. Current Medications
                </h3>
                {profile.medications.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {profile.medications.map((m, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold">
                        {m}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No medications listed</p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Notebook className="w-3.5 h-3.5 text-slate-400" />
                  5. Health Preferences & Notes
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {profile.notes || 'No custom preferences specified.'}
                </p>
              </div>
            </div>

            {/* Emergency Information */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                6. Emergency Information
              </h3>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <span>Primary Emergency Contact: Dr. Sarah Jenkins (Cardiology)</span>
                <span className="font-mono text-slate-400">+1 (555) 019-2831</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
