import React, { Component, useState, useEffect } from 'react'
import getWeb3 from './getWeb3'
import ReactDOM from 'react-dom'

import potOfGoldEmptyImg from './assets/pot-of-gold-empty.png'
import potOfGoldFullImg from './assets/pot-of-gold-full.png'

import EthDropCore from './contracts/EthDropCore.json'
import {
  BrowserRouter,
  useParams,
  useLocation,
  withRouter,
  Link,
} from 'react-router-dom'

import { FillButton } from 'tailwind-react-ui'
import { shortenedAddress } from './shortened-address'

function GroupEventPage(props) {
  const [accounts, setAccounts] = useState([])
  const [ethDropCoreInstance, setEthDropCoreInstance] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [isCOO, setIsCOO] = useState(null)
  const [isAdmin, setIsAdmin] = useState(null)
  const [isContributor, setIsContributor] = useState(null)
  const [adminsForGroup, setAdminsForGroup] = useState([])
  const [isEligibleRecipient, setIsEligibleRecipient] = useState('')
  const [groupEventData, setGroupEventData] = useState('')
  const [newAdminInputValue, setNewAdminInputValue] = useState('')
  const [eligibleRecipients, setEligibleRecipients] = useState('')
  const [registeredRecipients, setRegisteredRecipients] = useState('')
  const [
    newEligibleRecipientAddressInputValue,
    setEligibleRecipientAddressInputValue,
  ] = useState('')
  const [
    newEligibleRecipientNameInputValue,
    setEligibleRecipientNameInputValue,
  ] = useState('')
  const [
    eligibleRecipientsEligibilityEnabled,
    setEligibleRecipientsEligibilityEnabled,
  ] = useState('')
  const [isRegisteredRecipient, setIsRegisteredRecipient] = useState('')
  const [contributionAmountInputValue, setContributionAmount] = useState('')
  const [newSponsorInputValue, setNewSponsorInputValue] = useState('')
  const [
    updateSponsorNameInputValue,
    setUpdateSponsorNameInputValue,
  ] = useState('')
  const [updateSponsorImgInputValue, setUpdateSponsorImgInputValue] = useState(
    '',
  )
  const [
    updateSponsorLinkToInputValue,
    setUpdateSponsorLinkToInputValue,
  ] = useState('')
  const [currentSponsorAddress, setCurrentSponsorAddress] = useState('')
  const [currentSponsorName, setCurrentSponsorName] = useState('')
  const [currentSponsorImgLinkTo, setCurrentSponsorImgLinkTo] = useState('')
  const [currentSponsorImg, setCurrentSponsorImg] = useState('')
  const [hasClaimableWinnings, setHasClaimableWinnings] = useState('')

  // const forceUpdate = React.useReducer(bool => !bool)[1];

  const groupName = useParams().groupName
  const groupId = useParams().groupId

  // const location = useLocation();

  // let location = useLocation();

  React.useEffect(() => {
    // ga.send(["pageview", location.pathname]);

    console.log('^^ using effect!')

    fetchData();

    console.log('stuff happening...')
  }, [])

  async function fetchData() {
    try {
      console.log('fetch start')

      const web3 = await getWeb3()
      console.log('web3 ', web3)
      setWeb3(web3)

      // ReactDOM.unstable_batchedUpdates(async () => {
      // this.setState({a: true}); // Doesn't re-render yet
      // this.setState({b: true}); // Doesn't re-render yet

      const accounts = await web3.eth.getAccounts()

      const networkId = await web3.eth.net.getId()
      const deployedNetwork = EthDropCore.networks[networkId]

      const ethDropCoreInstance = new web3.eth.Contract(
        EthDropCore.abi,
        deployedNetwork && deployedNetwork.address,
      )

      setEthDropCoreInstance(ethDropCoreInstance)
      setAccounts(accounts)

      const isAdmin = await ethDropCoreInstance.methods
        .amIAdmin(groupId)
        .call({ from: accounts[0] })
      console.log('isAdmin ', isAdmin)
      setIsAdmin(isAdmin)

      const isCOO = await ethDropCoreInstance.methods
        .isCOO()
        .call({ from: accounts[0] })
      console.log('isCOO ', isCOO)
      setIsCOO(isCOO)

      const isEligibleRecipient = await ethDropCoreInstance.methods
        .amIEligibleRecipient(groupId)
        .call({ from: accounts[0] })
      console.log('isEligibleRecipient ', isEligibleRecipient)
      setIsEligibleRecipient(isEligibleRecipient)

      const isRegisteredRecipient = await ethDropCoreInstance.methods
        .amIRegisteredRecipient(groupId)
        .call({ from: accounts[0] })
      console.log('isRegisteredRecipient ', isRegisteredRecipient)
      setIsRegisteredRecipient(isRegisteredRecipient)

      const hasClaimableWinnings = await ethDropCoreInstance.methods
        .doIHaveClaimableWinnings(groupId)
        .call({ from: accounts[0] })
      console.log('hasClaimableWinnings ', hasClaimableWinnings)
      setHasClaimableWinnings(hasClaimableWinnings)

      const isContributor = await ethDropCoreInstance.methods
        .amIContributor(groupId)
        .call({ from: accounts[0] })
      console.log('isContributor ', isContributor)
      setIsContributor(isContributor)

      const currentSponsorAddress = await ethDropCoreInstance.methods
        .getCurrentSponsorAddress(groupId)
        .call({ from: accounts[0] })
      console.log('currentSponsorAddress ', currentSponsorAddress)
      setCurrentSponsorAddress(currentSponsorAddress)

      const adminsForGroup = await ethDropCoreInstance.methods
        .getAdminsForGroup(groupId)
        .call({ from: accounts[0] })
      console.log('adminsForGroup ', adminsForGroup)
      setAdminsForGroup(adminsForGroup)

      const groupEventData = await ethDropCoreInstance.methods
        .getGroupEventData(groupId)
        .call({ from: accounts[0] })
      console.log('groupEventData ', groupEventData)
      setGroupEventData(groupEventData)

      const eligibleRecipients = await ethDropCoreInstance.methods
        .getEligibleRecipientAddresses(groupId)
        .call({ from: accounts[0] })
      console.log('eligibleRecipients ', eligibleRecipients)
      setEligibleRecipients(eligibleRecipients)

      const eligibleRecipientsEligibilityEnabled = await ethDropCoreInstance.methods
        .getEligibleRecipientIsEligibilityEnabled(groupId)
        .call({ from: accounts[0] })
      console.log(
        'eligibleRecipientsEligibilityEnabled ',
        eligibleRecipientsEligibilityEnabled,
      )
      setEligibleRecipientsEligibilityEnabled(
        eligibleRecipientsEligibilityEnabled,
      )

      const registeredRecipients = await ethDropCoreInstance.methods
        .getRegisteredRecipientNames(groupId)
        .call({ from: accounts[0] })
      console.log('registeredRecipients ', registeredRecipients)
      setRegisteredRecipients(registeredRecipients)

      const sponsorInfo = await ethDropCoreInstance.methods
        .getContributorInfo(groupId)
        .call({ from: accounts[0] })
      console.log('sponsorInfo ', sponsorInfo)


      setCurrentSponsorName(sponsorInfo[0])
      setCurrentSponsorImg(sponsorInfo[1])
      setCurrentSponsorImgLinkTo(sponsorInfo[2])

      // await forceUpdate();
      console.log('fetch end')

      // });
      console.log('done fetching')
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract.` + error)
      console.error(error)
    }
  }

  async function removeAdmin(address) {
    try {
      const isAdmin = await ethDropCoreInstance.methods
        .removeAdmin()
        .send({ from: accounts[0] })
      console.log('admin removed!')
      setIsAdmin(isAdmin)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to remove admin...` + error)
    }
  }

  async function startAirdropEvent(groupId) {
    try {
      await ethDropCoreInstance.methods
        .startEvent(groupId)
        .send({ from: accounts[0] })
      console.log('event started!')
      // setIsAdmin(isAdmin);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to start event...` + error)
    }
  }

  async function endRegistration(groupId) {
    try {
      await ethDropCoreInstance.methods
        .closeEventRegistration(groupId)
        .send({ from: accounts[0] })
      console.log('closed event registration!')
    } catch (error) {
      alert(`Failed to close event registration...` + error)
    }
  }

  async function endEvent(groupId) {
    try {
      await ethDropCoreInstance.methods
        .endEvent(groupId)
        .send({ from: accounts[0] })
      console.log('ended event!')
    } catch (error) {
      alert(`Failed to end event...` + error)
    }
  }

  async function registerForEvent(groupId) {
    try {
      await ethDropCoreInstance.methods
        .registerForEvent(groupId)
        .send({ from: accounts[0] })
      console.log('registered for event!')
    } catch (error) {
      alert(`Failed to register for event...` + error)
    }
  }

  async function claimWinnings(groupId) {
    try {
      await ethDropCoreInstance.methods
        .claimWinnings(groupId)
        .send({ from: accounts[0] })
      console.log('claimed winnings!')
    } catch (error) {
      alert(`Failed to claim winnings...` + error)
    }
  }

  async function newEligibleRecipientSubmit(event) {
    event.preventDefault()

    try {
      await ethDropCoreInstance.methods
        .addEligibleRecipient(newEligibleRecipientAddressInputValue,
          newEligibleRecipientNameInputValue,
          groupId)
        .send({ from: accounts[0] })
      console.log('added eligible recipient! ')
    } catch (err) {
      console.log('adding eligible recipient failed...', err)
    }
  }

  function newAdminHandleChange(event) {
    setNewAdminInputValue(event.target.value)
  }

  function newEligibleRecipientAddressHandleChange(event) {
    setEligibleRecipientAddressInputValue(event.target.value)
  }

  function newEligibleRecipientNameHandleChange(event) {
    setEligibleRecipientNameInputValue(event.target.value)
  }

  function contributionAmountHandleChange(event) {
    setContributionAmount(event.target.value)
  }

  function newSponsorHandleChange(event) {
    setNewSponsorInputValue(event.target.value)
  }

  function updateSponsorNameHandleChange(event) {
    setUpdateSponsorNameInputValue(event.target.value)
  }

  function updateSponsorImgHandleChange(event) {
    setUpdateSponsorImgInputValue(event.target.value)
  }

  function updateSponsorLinkToHandleChange(event) {
    setUpdateSponsorLinkToInputValue(event.target.value)
  }

  async function newAdminSubmit(event) {
    event.preventDefault()

    try {
      const createdGroup = await ethDropCoreInstance.methods
        .addAdmin(newAdminInputValue, groupId)
        .send({ from: accounts[0] })
      console.log('added admin! ')
    } catch (err) {
      console.log('adding admin failed...', err)
    }
  }

  async function newSponsorSubmit(event) {
    event.preventDefault()

    try {
      await ethDropCoreInstance.methods
        .changeContributor(newSponsorInputValue, groupId)
        .send({ from: accounts[0] })
      console.log('contributior changed! ')
    } catch (err) {
      console.log('changing contributor failed...', err)
    }
  }

  async function submitUpdateContributorInfo(event) {
    event.preventDefault()

    try {
      await ethDropCoreInstance.methods
        .updateContributorInfo(
          groupId,
          updateSponsorNameInputValue,
          updateSponsorImgInputValue,
          updateSponsorLinkToInputValue,
        )
        .send({ from: accounts[0] })
      console.log('contributor changed! ')
    } catch (err) {
      console.log('changing contributor failed...', err)
    }
  }

  async function submitContribution(event) {
    event.preventDefault()

    try {
      const weiAmount = web3.utils.toWei(contributionAmountInputValue, 'ether')

      await ethDropCoreInstance.methods
        .contributeToPot(groupId)
        .send({ value: weiAmount, from: accounts[0] })
      console.log('contribution submitted! ')

      setContributionAmount('')
    } catch (err) {
      console.log('submitting contribution failed...', err)
    }
  }

  if (!web3) {
    return <h1>Loading web3...Group event page! {groupName}</h1>
  }

  if (web3)
    return (
      <div className="App">

        <div className="mx-5 my-10">

          <h1>{groupName}</h1>
        </div>

        {isCOO && (
          <div
            style={{
              margin: '2vw',
              padding: '20px',
              border: 'solid black 2px',
              borderRadius: '20px',
            }}
          >
            <h3>You are the COO!</h3>
            <br />
            <p>Since you are the COO, you can add and remove admins.</p>
            <h2>Admins</h2>
            {/* {adminsForGroup[0] && +adminsForGroup[0].length} */}
            {adminsForGroup &&
              adminsForGroup[0] &&
              adminsForGroup[0].length !== null && (
                <div>
                  {+adminsForGroup[0].length > 0 && (
                    <table className="table-fixed border border-blue-200 border-8 min-w-full my-10 rounded">
                      <thead>
                        <tr>
                          <th className="w-3/4 p-2 border-4 border-blue-200">
                            Address
                          </th>
                          <th className="w-1/4 p-2 border-4 border-blue-200">
                            Manage
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {adminsForGroup[0].map((adminAddress, i) => {
                          return (
                            <tr key={adminAddress + i}>
                              <td className="border-4 border-blue-200">{`${adminAddress}`}</td>

                              <td className="border-4 border-blue-200">
                                <FillButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 my-4 rounded">
                                  <h4>
                                    <a
                                      style={{ textDecoration: 'none' }}
                                      onClick={() =>
                                        alert('this button does nothing yet...')
                                      }
                                    >
                                      x
                                    </a>
                                  </h4>
                                </FillButton>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            {/* <form onSubmit={newAdminSubmit}>
            <label>
              New Admin Address:
              <input type="text" value={newAdminInputValue} onChange={newAdminHandleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form> */}
            <div className="w-full max-w-m">
              <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={newAdminSubmit}
              >
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 my-4"
                    htmlFor="new-ceo"
                  >
                    <div className="my-4">New Admin Address:</div>
                  </label>
                  <input
                    className="shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="new-cfo"
                    type="text"
                    placeholder="0x1234..."
                    value={newAdminInputValue}
                    onChange={newAdminHandleChange}
                  />
                  {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={newAdminSubmit}
                    type="submit"
                    value="Submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Add New Admin
                  </button>
                </div>
              </form>
            </div>
            <br />
            <br />
          </div>
        )}

        {isAdmin && (
          <div
            style={{
              margin: '2vw',
              padding: '20px',
              border: 'solid black 2px',
              borderRadius: '20px',
            }}
          >
            <h1>You are an Admin!</h1>
            <br />
            <p>That means you can change the address of the current sponsor!</p>
            <br />
            <br />
            The current sponsor is: {currentSponsorAddress}
            <br />
            <br />
            <br />
            {/* <form onSubmit={newSponsorSubmit}>
              <label>
                New Sponsor Address:
                <input type="text" value={newSponsorInputValue} onChange={newSponsorHandleChange} />
              </label>
              <input type="submit" value="Submit" />
            </form> */}
            <div className="w-full max-w-m">
              <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={newSponsorSubmit}
              >
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 my-4"
                    htmlFor="new-ceo"
                  >
                    <div className="my-4">New Sponsor Address:</div>
                  </label>
                  <input
                    className="shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="new-cfo"
                    type="text"
                    placeholder="0x1234..."
                    value={newSponsorInputValue}
                    onChange={newSponsorHandleChange}
                  />
                  {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={newSponsorSubmit}
                    type="submit"
                    value="Submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Update Sponsor
                  </button>
                </div>
              </form>
            </div>
            <br />
            <br />
            <p>
              Since you are an admin you can add and remove{' '}
              <i>eligible recipients.</i>
            </p>
            <br />
            <h1>Eligible Recipients</h1>
            <br />
            <br />
            {eligibleRecipients[0] &&
              eligibleRecipients.map((eligibleRecipient, i) => {
                return (
                  <li key={'eligibleRecipient' + i}>
                    {/* <p> */}
                    {eligibleRecipient} -{' '}
                    {JSON.stringify(eligibleRecipientsEligibilityEnabled[i])}
                    {/* </p> */}
                    <br />
                    <br />
                    <br />
                  </li>
                )
              })}
            <br />
            <br />
            {/* <form onSubmit={newEligibleRecipientSubmit}>
              <label>
                New Eligible Recipient Address:
                <input type="text" value={newEligibleRecipientAddressInputValue} onChange={newEligibleRecipientAddressHandleChange} />
              </label>
              <input type="submit" value="Submit" />
            </form> */}
            <div className="w-full max-w-m">
              <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={newEligibleRecipientSubmit}
              >
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 my-4"
                    htmlFor="new-recipient-address"
                  >
                    <div className="my-4">New Eligible Recipient Address:</div>
                  </label>
                  <input
                    className="shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="new-recipient-address"
                    type="text"
                    placeholder="0x1234..."
                    value={newEligibleRecipientAddressInputValue}
                    onChange={newEligibleRecipientAddressHandleChange}
                  />
                  {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 my-4"
                    htmlFor="new-ceo"
                  >
                    <div className="my-4">New Eligible Recipient Name:</div>
                  </label>
                  <input
                    className="shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="new-cfo"
                    type="text"
                    placeholder="Bob"
                    value={newEligibleRecipientNameInputValue}
                    onChange={newEligibleRecipientNameHandleChange}
                  />
                  {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                </div>
                <div className="flex items-center justify-center">
                  <button
                    onClick={newEligibleRecipientSubmit}
                    type="submit"
                    value="Submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Set New Eligible Recipient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {((groupEventData && groupEventData[0] === '0') ||
          groupEventData[0] === '3') && (
            <div className="my-10">
              <h2>There is no event currently in progress!</h2>

              <br />
              <br />

              <h4>
                Check with the group admins for information on when the next
                airdrop event is happening!
              </h4>
            </div>
          )}

        {/* Today's Sponsor Header */}
        <div className="my-5 mx-4">
          <p>Event Sponsor:</p>

          {!currentSponsorName && <p>(Sponsor has not yet set their name)</p>}
          <p></p>
          <h1> {currentSponsorName}</h1>
        </div>

        {/* Sponsor Image */}
        <div className="my-5 mx-4">
          {currentSponsorName && (
            <a href={currentSponsorImgLinkTo}>
              <img src={currentSponsorImg} class="w-85 my-10 mx-auto" />
            </a>
          )}

          {!currentSponsorName && <p>(Sponsor has not yet set their image)</p>}
        </div>

        {/* The Pot Section */}

        {groupEventData && groupEventData[2] && (
          <div>
            <div className="mt-10 py-5">
              <h2 className="m-5">There Is Currently</h2>
              <h1 className="my-10">
                {groupEventData &&
                  groupEventData[2] &&
                  web3.utils.fromWei(groupEventData[2], 'ether') + ' Eth'}
              </h1>
              <h2 className="m-5">
                In The Pot{+groupEventData[2] > 0 ? '!' : '.'}
              </h2>
              {/* <h1></h1> */}

              {+groupEventData[2] === 0 && (
                <div className="mt-10">
                  <img
                    src={potOfGoldEmptyImg}
                    alt="pot of gold empty"
                    className="m-auto w-1/4"
                  ></img>
                </div>
              )}

              {+groupEventData[2] > 0 && (
                <div className="mt-10">
                  <img
                    src={potOfGoldFullImg}
                    alt="pot of gold full"
                    className="m-auto w-1/4"
                  ></img>
                </div>
              )}
            </div>
            <hr className="m-2" />
          </div>
        )}

        {/* Phase 0 - Has Not yet started (or 3- ended) */}
        {((groupEventData && groupEventData[0] === '0') ||
          groupEventData[0] === '3') && (
            <div>
              {isEligibleRecipient && (
                <div>
                  <p>You are an eligible recipient for airdrops by this group!</p>
                </div>
              )}

              {isAdmin && (
                <div className="m-3 mb-10">
                  <p>
                    Since you are an admin, you can start the event by opening
                    registration!
                  </p>
                  <button
                    onClick={() => startAirdropEvent(groupId)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Open AirDrop Registration
                  </button>
                </div>
              )}

              {!isAdmin && (
                <div>
                  <p>Waiting for a group admin to open registration...</p>
                </div>
              )}
            </div>
          )}

        {/* Phase 1 - Registration */}
        {groupEventData && groupEventData[0] === '1' && (
          <div>
            {/* Phase 2 - Registration */}

            <p>There is currently an event in progress!</p>

            {isAdmin && (
              <div>
                <p>
                  Since you are an admin, you can move the event from
                  registration phase to claim winnings phase!
                </p>
                <button
                  onClick={() => endRegistration(groupId)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  End Registration Phase
                </button>
              </div>
            )}
            <br />
            {isEligibleRecipient && (
              <div>
                {isRegisteredRecipient && (
                  <div>
                    <p>You are registered for this event!</p>
                  </div>
                )}

                {!isRegisteredRecipient && (
                  <div>
                    <p>You are an eligible recipient for this event!</p>
                    <p>Click the button to register!</p>
                    <button
                      onClick={() => registerForEvent(groupId)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Register!
                    </button>
                  </div>
                )}
              </div>
            )}
            {!isEligibleRecipient && (
              <div>
                You are not an eligible recipient for this airdrop! Get in touch
                with the group admins to be added!
              </div>
            )}
          </div>
        )}

        {isContributor && (
          <div
            style={{
              margin: '2vw',
              padding: '20px',
              border: 'solid black 2px',
              borderRadius: '20px',
            }}
          >
            <h1>You are the sponsor for this event!</h1>

            <p>You can update your sponsor details here!</p>

            <div className="w-full max-w-m">
              <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={submitUpdateContributorInfo}
              >
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 my-4"
                    htmlFor="new-ceo"
                  >
                    <div className="my-4">Sponsor Name</div>
                  </label>

                  <input
                    className="shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="new-cfo"
                    type="text"
                    placeholder="0x1234..."
                    value={updateSponsorNameInputValue}
                    onChange={updateSponsorNameHandleChange}
                  />
                  {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 my-4"
                    htmlFor="new-ceo"
                  >
                    <div className="my-4">Sponsor Image Url:</div>
                  </label>

                  <input
                    className="shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="new-cfo"
                    type="text"
                    placeholder="0x1234..."
                    value={updateSponsorImgInputValue}
                    onChange={updateSponsorImgHandleChange}
                  />
                  {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 my-4"
                    htmlFor="new-ceo"
                  >
                    <div className="my-4">Sponsor Link To Url:</div>
                  </label>

                  <input
                    className="shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="new-cfo"
                    type="text"
                    placeholder="0x1234..."
                    value={updateSponsorLinkToInputValue}
                    onChange={updateSponsorLinkToHandleChange}
                  />
                  {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={submitUpdateContributorInfo}
                    type="submit"
                    value="Submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Update Sponsor Info
                  </button>
                </div>
              </form>
            </div>

            {/*  Only when not currently in progress */}
            {groupEventData && groupEventData[0] === '2' && (
              <div>
                Sorry, you can't contribute to the pot at this time because the
                event is in the "claim winnings" phase!
              </div>
            )}

            {groupEventData && groupEventData[0] !== '2' && (
              <div>
                <p>You can contribute ether to the pot here.</p>
                Choose the amount you would like to contribute and then hit
                "submit".
                <div className="w-full max-w-m">
                  <form
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={submitContribution}
                  >
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2 my-4"
                        htmlFor="new-ceo"
                      >
                        <div className="my-4">Ether to contribute:&nbsp;</div>
                      </label>
                      <input
                        className="shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="new-cfo"
                        type="number"
                        placeholder="0.01"
                        step="0.01"
                        value={contributionAmountInputValue}
                        onChange={contributionAmountHandleChange}
                      />
                      {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={submitContribution}
                        type="submit"
                        value="Submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                      >
                        Submit Contribution
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <br />
            <br />
          </div>
        )}

        {/* Phase 2 - Claiming Winnings */}
        {groupEventData && groupEventData[0] === '2' && (
          <div>
            {isAdmin && (
              <div>
                <p>Since you are an admin, you can end the event!</p>
                <br />

                <button
                  onClick={() => endEvent(groupId)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  End Event
                </button>
              </div>
            )}

            {isRegisteredRecipient && (
              <div>
                <p>Click the button below to claim your winnings!!</p>

                <button
                  onClick={() => claimWinnings(groupId)}
                  disabled={!hasClaimableWinnings}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Claim Winnings
                </button>
              </div>
            )}
          </div>
        )}

        <hr className="m-5"/>

        {registeredRecipients && registeredRecipients.length > 0 && <div>

          <h3 className="my-10">
            Registered Users:
          </h3>
          <ul>

            {registeredRecipients.map((recipientName, i) => {
              return <li key={'recipName ' + i} className="m-5 my-10">
                <h1>{'-  ' + recipientName}</h1>
              </li>
            })}
          </ul>

        </div>}

        <br />
        <br />
      </div>
    )
}

export default withRouter(GroupEventPage)
