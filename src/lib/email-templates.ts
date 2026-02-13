import { brand } from '@/lib/brand'

interface EngineeringRequestEmailInput {
  requestId: string
  name: string
  email: string
  company?: string
  projectType: string
  budget?: string
  timeline?: string
  message: string
}

export function requesterConfirmationTemplate(input: EngineeringRequestEmailInput) {
  return {
    subject: `Request received (#${input.requestId.slice(0, 8)})`,
    text: [
      `Hi ${input.name},`,
      '',
      'Your engineering request has been received.',
      `Request ID: ${input.requestId}`,
      `Project type: ${input.projectType}`,
      '',
      'If your request is a fit, we will follow up for a short alignment call.',
      '',
      `Engineering hub: ${brand.urls.engineeringHub}`,
    ].join('\n'),
    html: `<p>Hi ${input.name},</p><p>Your engineering request has been received.</p><p><strong>Request ID:</strong> ${input.requestId}<br/><strong>Project type:</strong> ${input.projectType}</p><p>If your request is a fit, we will follow up for a short alignment call.</p><p><a href="${brand.urls.engineeringHub}">Engineering hub</a></p>`,
  }
}

export function internalNotificationTemplate(input: EngineeringRequestEmailInput) {
  return {
    subject: `New engineering request: ${input.projectType} (#${input.requestId.slice(0, 8)})`,
    text: [
      `Request ID: ${input.requestId}`,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Company: ${input.company || '-'}`,
      `Project Type: ${input.projectType}`,
      `Budget: ${input.budget || '-'}`,
      `Timeline: ${input.timeline || '-'}`,
      '',
      'Message:',
      input.message,
    ].join('\n'),
    html: `<p><strong>Request ID:</strong> ${input.requestId}</p><p><strong>Name:</strong> ${input.name}<br/><strong>Email:</strong> ${input.email}<br/><strong>Company:</strong> ${input.company || '-'}<br/><strong>Project Type:</strong> ${input.projectType}<br/><strong>Budget:</strong> ${input.budget || '-'}<br/><strong>Timeline:</strong> ${input.timeline || '-'}</p><p><strong>Message:</strong></p><p>${input.message.replace(/\n/g, '<br/>')}</p>`,
  }
}

