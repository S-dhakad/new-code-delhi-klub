'use client';
import React from 'react';
import Button from '../../../common/ui/Button';

const FeaturePost: React.FC = () => {
  return (
    <div className="p-4 space-y-3 text-sm text-text-secondary">
      <p>Highlight a post on your profile.</p>
      <Button disabled>Save Changes</Button>
    </div>
  );
};

export default FeaturePost;
