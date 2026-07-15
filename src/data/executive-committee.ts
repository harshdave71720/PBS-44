export type ExecutiveCommitteeCategory = "OFFICE_BEARER" | "MEMBER"

export interface ExecutiveCommitteePerson {
  imageKey: string
  name: string
  designation: string
  category: ExecutiveCommitteeCategory
}

export const EXECUTIVE_COMMITTEE_MEMBERS: ExecutiveCommitteePerson[] = [
  {
    imageKey: "bhuralal_vyas",
    name: "श्री भूरालाल रूपलाल जी व्यास",
    designation: "अध्यक्ष",
    category: "OFFICE_BEARER",
  },
  {
    imageKey: "madanlal_bagora",
    name: "श्री मदनलाल जीवनरामजी बागोरा",
    designation: "उपाध्यक्ष",
    category: "OFFICE_BEARER",
  },
  {
    imageKey: "vijayshankar_joshi",
    name: "श्री विजयशंकर जमनालालजी जोशी",
    designation: "मंत्री",
    category: "OFFICE_BEARER",
  },
  {
    imageKey: "rewashankar_purohit",
    name: "श्री रेखाशंकर गोवर्धनजी पुरोहित",
    designation: "सह मंत्री",
    category: "OFFICE_BEARER",
  },
  {
    imageKey: "omprakash_dave",
    name: "श्री ओमप्रकाश राजूलालजी दवे",
    designation: "कोषमंत्री",
    category: "OFFICE_BEARER",
  },
  {
    imageKey: "mukesh_upadhyay",
    name: "श्री मुकेश भंवरलालजी उपाध्याय",
    designation: "भवन मंत्री",
    category: "OFFICE_BEARER",
  },
  {
    imageKey: "suresh_dave",
    name: "श्री सुरेश भोलीरामजी दवे",
    designation: "शिक्षा मंत्री",
    category: "OFFICE_BEARER",
  },
  {
    imageKey: "dharmnarayan_purohit",
    name: "श्री धर्मनारायण लक्ष्मणजी पुरोहित",
    designation: "भंडार मंत्री",
    category: "OFFICE_BEARER",
  },
  {
    imageKey: "jamnalal_vyas",
    name: "श्री जमनालाल नन्दकिशोरजी व्यास ( गुड्डा )",
    designation: "उत्सव मंत्री",
    category: "OFFICE_BEARER",
  },
  {
    imageKey: "ramesh_bhanwarlal_dave",
    name: "श्री रमेश भंवरलाल जी देव",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "omprakash_joshi",
    name: "श्री ओमप्रकाश भेरूलालजी जोशी",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "jivraj_joshi",
    name: "श्री जीवराज हीरालालजी जोशी",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "krishnakant_joshi",
    name: "श्री कृष्णकांत (कानु) लक्ष्मीनारायणजी जोशी",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "shivlal_purohit",
    name: "श्री शिवलाल इन्दरलालजी पुरोहित",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "mukesh_vyas",
    name: "श्री मुकेश गोपीलालजी व्यास",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "mahesh_joshi",
    name: "श्री महेश प्रेमनारायणजी जोशी",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "mukesh_bagora",
    name: "श्री मुकेश पन्नालाल जी बागोरा",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "pramod_dave",
    name: "श्री प्रमोद रंगलालजी देव",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "kailash_upadhyay",
    name: "श्री कैलाश डालचंदजी उपाध्याय",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "suresh_kishorilal_joshi",
    name: "श्री सुरेश किशोरीलालजी जोशी",
    designation: "सदस्य",
    category: "MEMBER",
  },
  {
    imageKey: "rajesh_joshi",
    name: "श्री राजेश बंसीलालजी जोशी",
    designation: "सदस्य",
    category: "MEMBER",
  },
]

export const OFFICE_BEARERS = EXECUTIVE_COMMITTEE_MEMBERS.filter(
  (member) => member.category === "OFFICE_BEARER"
)

export const COMMITTEE_MEMBERS = EXECUTIVE_COMMITTEE_MEMBERS.filter(
  (member) => member.category === "MEMBER"
)

