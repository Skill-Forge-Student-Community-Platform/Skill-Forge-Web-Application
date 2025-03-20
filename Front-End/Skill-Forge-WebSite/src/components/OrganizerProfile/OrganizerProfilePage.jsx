import React from 'react'
import OrganizerCover from './shared/OrganizerCover'
import ProfileIntro from './Organizer/ProfileIntro'
import EventManagement from './Organizer/EventManagement'

export default function OrganizerProfilePage() {
  return (
    <div>
      <OrganizerCover/>
      <ProfileIntro/>
      <EventManagement/>
    </div>
  )
}
