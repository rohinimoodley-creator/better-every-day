import React from 'react';
import ContextualPip from './ContextualPip';

export default function MascotCompanion({ message, mood = 'happy', context = 'home' }) {
  return (
    <ContextualPip 
      context={context} 
      layout="banner" 
      size={64} 
      customMessage={message} 
      moodOverride={mood} 
      interactive={true} 
    />
  );
}
