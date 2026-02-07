// Contact Form API Usage Example

async function submitContact() {
  const formData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!',
  }

  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  const data = await res.json()
  console.log(data)
}
