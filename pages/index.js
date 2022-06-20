import { useState, useEffect } from 'react'
import { client, recommendProfiles } from '../api'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendProfiles).toPromise()
      console.log('🚀 ~ fetchProfiles ~ response', response)
      setProfiles(response.data.recommendedProfiles)
    } catch (error) {
      console.log('🚀 ~ fetchProfiles ~ error', error)
    }
  }
  return (
    <div>
      {profiles.map((profile, i) => {
        {
          /* console.log('🚀 ~  {profiles.map ~ profile', profile) */
        }
        return (
          <Link href={`/profile/${profile.id}`} passHref>
            <a>
              <div style={{ margin: '20px', border: '1px solid black', borderRadius: '4px' }}>
                {profile.picture ? (
                  <Image
                    src={profile.picture.original.url}
                    width='60px'
                    height='60px'
                    style={{ border: '1px solid gray', borderRadius: '50%' }}
                  />
                ) : (
                  <div
                    style={{
                      border: '1px solid gray',
                      backgroundColor: 'gray',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                    }}
                  />
                )}
                <h4>{profile.handle}</h4>
                <p>{profile.bio}</p>
              </div>
            </a>
          </Link>
        )
      })}
    </div>
  )
}
