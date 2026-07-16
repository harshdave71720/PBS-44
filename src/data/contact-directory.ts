export type ContactDirectoryCategory = "OFFICE_BEARER" | "MEMBER"

export interface ContactDirectoryEntry {
  srNo: number
  name: string
  designation: string
  village: string
  mobile: string
  category: ContactDirectoryCategory
}

export const CONTACT_DIRECTORY: ContactDirectoryEntry[] = [
  {
    srNo: 1,
    name: "श्री भूरालाल रूपलाल जी व्यास",
    designation: "अध्यक्ष",
    village: "जावद",
    mobile: "93297-57602",
    category: "OFFICE_BEARER",
  },
  {
    srNo: 2,
    name: "श्री मदनलाल जीवनरामजी बागोरा",
    designation: "उपाध्यक्ष",
    village: "मेरडा",
    mobile: "94253-47512",
    category: "OFFICE_BEARER",
  },
  {
    srNo: 3,
    name: "श्री विजयशंकर जमनालालजी जोशी",
    designation: "मंत्री",
    village: "आमली",
    mobile: "98266-53472",
    category: "OFFICE_BEARER",
  },
  {
    srNo: 4,
    name: "श्री रेवाशंकर गोवर्धनजी पुरोहित",
    designation: "सह मंत्री",
    village: "धांचला (तीरों का)",
    mobile: "98260-30103",
    category: "OFFICE_BEARER",
  },
  {
    srNo: 5,
    name: "श्री ओमप्रकाश राजूलालजी दवे",
    designation: "कोषमंत्री",
    village: "ब्राह्मण टूकड़ा",
    mobile: "98266-45655",
    category: "OFFICE_BEARER",
  },
  {
    srNo: 6,
    name: "श्री मुकेश भंवरलालजी उपाध्याय",
    designation: "भवन मंत्री",
    village: "भाणग्लोल की खेड़ी",
    mobile: "93032-79053",
    category: "OFFICE_BEARER",
  },
  {
    srNo: 7,
    name: "श्री सुरेश भोलीरामजी दवे",
    designation: "शिक्षा मंत्री",
    village: "ब्राह्मण टूकड़ा",
    mobile: "99772-13300",
    category: "OFFICE_BEARER",
  },
  {
    srNo: 8,
    name: "श्री धर्मनारायण लक्ष्मणजी पुरोहित",
    designation: "भंडार मंत्री",
    village: "बड़ा भाणुजा",
    mobile: "99075-23254",
    category: "OFFICE_BEARER",
  },
  {
    srNo: 9,
    name: "श्री जमनालाल नन्दकिशोरजी व्यास ( गुड्डा )",
    designation: "उत्सव मंत्री",
    village: "जावद",
    mobile: "98262-32846",
    category: "OFFICE_BEARER",
  },
  {
    srNo: 1,
    name: "श्री रमेश भंवरलाल जी दवे",
    designation: "सदस्य",
    village: "ब्राह्मण टूकड़ा",
    mobile: "98275-92756",
    category: "MEMBER",
  },
  {
    srNo: 2,
    name: "श्री ओमप्रकाश भेरूलालजी जोशी",
    designation: "सदस्य",
    village: "उघोल",
    mobile: "98263-20571",
    category: "MEMBER",
  },
  {
    srNo: 3,
    name: "श्री जीवराज हीरालालजी जोशी",
    designation: "सदस्य",
    village: "उघोल",
    mobile: "93021-02588",
    category: "MEMBER",
  },
  {
    srNo: 4,
    name: "श्री कृष्णकांत (कानु) लक्ष्मीनारायणजी जोशी",
    designation: "सदस्य",
    village: "आमली",
    mobile: "98265-33401",
    category: "MEMBER",
  },
  {
    srNo: 5,
    name: "श्री शिवलाल इन्दरलालजी पुरोहित",
    designation: "सदस्य",
    village: "जैतपुरा",
    mobile: "94253-46682",
    category: "MEMBER",
  },
  {
    srNo: 6,
    name: "श्री मुकेश गोपीलालजी व्यास",
    designation: "सदस्य",
    village: "जावद",
    mobile: "98270-66462",
    category: "MEMBER",
  },
  {
    srNo: 7,
    name: "श्री महेश प्रेमनारायणजी जोशी",
    designation: "सदस्य",
    village: "ब्राह्मण टूकड़ा",
    mobile: "98266-31101",
    category: "MEMBER",
  },
  {
    srNo: 8,
    name: "श्री मुकेश पन्नालाल जी बागोरा",
    designation: "सदस्य",
    village: "मेरडा",
    mobile: "98273-34707",
    category: "MEMBER",
  },
  {
    srNo: 9,
    name: "श्री प्रमोद रंगलालजी देव",
    designation: "सदस्य",
    village: "ब्राह्मण टूकड़ा",
    mobile: "91116-87734",
    category: "MEMBER",
  },
  {
    srNo: 10,
    name: "श्री कैलाश डालचंदजी उपाध्याय",
    designation: "सदस्य",
    village: "भाणग्लोल की खेड़ी",
    mobile: "98262-04848",
    category: "MEMBER",
  },
  {
    srNo: 11,
    name: "श्री सुरेश किशोरीलालजी जोशी",
    designation: "सदस्य",
    village: "सालेरा",
    mobile: "88178-47229",
    category: "MEMBER",
  },
  {
    srNo: 12,
    name: "श्री राजेश बंसीलालजी जोशी",
    designation: "सदस्य",
    village: "बिजनोल",
    mobile: "98262-57475",
    category: "MEMBER",
  },
]

export const OFFICE_BEARER_CONTACTS = CONTACT_DIRECTORY.filter(
  (entry) => entry.category === "OFFICE_BEARER"
)

export const MEMBER_CONTACTS = CONTACT_DIRECTORY.filter((entry) => entry.category === "MEMBER")

