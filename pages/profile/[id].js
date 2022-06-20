import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { client, getProfiles, getPublications } from '../../api'
import Image from 'next/image'
import { ethers } from 'ethers'

import ABI from '../../abi.json'
const address = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'

export default function Profile() {
  const [profile, setProfile] = useState()
  const [pubs, setPubs] = useState([])
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchProfile()
    }
  }, [id])

  async function fetchProfile() {
    try {
      const response = await client.query(getProfiles, { id }).toPromise()
      // console.log('🚀 ~ fetchProfile ~ response ', response)
      setProfile(response.data.profiles.items[0])

      console.log(id)
      // return
      const publicationData = await client
        .query(getPublications, {
          id,
        })
        .toPromise()
      console.log('🚀 ~ fetchProfile ~ publicationData', publicationData)
      setPubs(publicationData.data.publications.items)
    } catch (error) {
      console.log('🚀 ~ fetchProfile ~ error', error)
    }
  }

  async function connect() {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    console.log('🚀 ~ connect ~ accounts', accounts)
  }

  async function followUser() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(address, ABI, signer)
    try {
      const tx = await contract.follow([id], [0x0])
      await tx.wait()
      console.log('followed user successfully')
    } catch (error) {
      console.log('🚀 ~ followUser ~ error', error)
    }
  }

  if (!profile) return null

  return (
    <div>
      <button onClick={connect}>Connect</button>
      {profile.picture ? (
        <Image src={profile.picture.original.url} width='120px' height='120px' />
      ) : (
        <div
          style={{
            border: '1px solid gray',
            backgroundColor: 'gray',
            borderRadius: '50%',
            width: '120px',
            height: '120px',
          }}
        />
      )}
      <div>
        <h4>{profile.handle}</h4>
        <p>{profile.bio}</p>
        <p>Followers: {profile.stats.totalFollowers}</p>
        <p>Following: {profile.stats.totalFollowing}</p>
      </div>
      <div>
        <button onClick={followUser}>Follow</button>
      </div>
      <div>
        {pubs.map((pub, index) => (
          <div style={{ padding: '20px', borderTop: '1px solid black' }}>{pub.metadata.content}</div>
        ))}
      </div>
    </div>
  )
}
