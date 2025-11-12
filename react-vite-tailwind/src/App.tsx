import React, { useState } from 'react'

type Difficulty = 'easy' | 'medium' | 'hard'

export default function App() {
  const [moduleName, setModuleName] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [template, setTemplate] = useState<File | null>(null)
  const [urls, setUrls] = useState<string[]>([''])
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [numQuestions, setNumQuestions] = useState<number>(10)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [generatedModule, setGeneratedModule] = useState<{
    downloadUrl: string
    viewUrl: string
    fileName: string
  } | null>(null)

  function handleAttachmentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0]
    if (!f) {
      setAttachment(null)
      return
    }
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|doc|docx)$/i)) {
      setMessage('Attachment must be a PDF or Word document (.pdf, .doc, .docx)')
      setAttachment(null)
      return
    }
    setMessage(null)
    setAttachment(f)
  }

  function handleTemplateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0]
    if (!f) {
      setTemplate(null)
      return
    }
    // accept only .html templates
    if (!f.type.includes('html') && !f.name.match(/\.html?$/i)) {
      setMessage('Template must be an HTML file (.html)')
      setTemplate(null)
      return
    }
    setMessage(null)
    setTemplate(f)
  }

  function handleUrlChange(index: number, value: string) {
    setUrls(prev => prev.map((u, i) => (i === index ? value : u)))
  }

  function addUrl() {
    setUrls(prev => [...prev, ''])
  }

  function removeUrl(index: number) {
    setUrls(prev => prev.filter((_, i) => i !== index))
  }

  function validate() {
    if (!moduleName.trim()) {
      setMessage('Module name is required')
      return false
    }
    if (!attachment) {
      setMessage('Please attach a PDF or Word document')
      return false
    }
    // basic url validation: allow empty entries to be ignored
    const invalid = urls.some(u => u.trim() && !/^https?:\/\/.+$/i.test(u.trim()))
    if (invalid) {
      setMessage('Please use valid http/https URLs for images/videos or leave empty fields blank')
      return false
    }
    setMessage(null)
    return true
  }

  function handleGenerate(e?: React.FormEvent) {
    e?.preventDefault()
    if (!validate()) return

    // build FormData and POST to backend
    setMessage('')
    setLoading(true)
    const fd = new FormData()
    fd.append('moduleName', moduleName.trim())
    if (attachment) fd.append('attachment', attachment)
    fd.append('difficulty', difficulty)
    fd.append('numQuestions', String(numQuestions))
    // send urls as JSON string
  fd.append('urls', JSON.stringify(urls.map(u => u.trim()).filter(u => u)))
  if (template) fd.append('template', template)

    fetch('http://localhost:5174/api/generate', { method: 'POST', body: fd })
      .then(async res => {
        const json = await res.json()
        if (!res.ok || !json.ok) throw new Error(json?.error || 'Generation failed')
        
        // Extract file name from URLs
        const downloadUrl = json.downloadUrl
        const viewUrl = json.viewUrl
        const fileName = downloadUrl ? downloadUrl.split('/').pop()?.split('/')[0] || 'module.html' : 'module.html'
        
        // Set the generated module data to show success page
        setGeneratedModule({
          downloadUrl: downloadUrl || viewUrl,
          viewUrl: viewUrl || downloadUrl,
          fileName: fileName
        })
        setMessage('Module generated successfully!')
      })
      .catch(err => {
        console.error(err)
        setMessage(String(err?.message || err))
      })
      .finally(() => setLoading(false))
  }

  function handleDownload() {
    if (generatedModule?.downloadUrl) {
      window.location.href = generatedModule.downloadUrl
    }
  }

  function handlePreview() {
    if (generatedModule?.viewUrl) {
      window.open(generatedModule.viewUrl, '_blank')
    }
  }

  function handleCreateNew() {
    // Reset form for new module
    setGeneratedModule(null)
    setModuleName('')
    setAttachment(null)
    setTemplate(null)
    setUrls([''])
    setDifficulty('easy')
    setNumQuestions(10)
    setMessage(null)
  }

  // Show success page if module is generated
  if (generatedModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-rose-50 flex items-center justify-center py-12">
        <div className="w-full max-w-2xl p-8 bg-white/90 backdrop-blur rounded-xl shadow-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Module Generated Successfully!</h1>
            <p className="text-slate-600">Your learning module has been created and is ready to download.</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">{generatedModule.fileName}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Module
            </button>
            
            <button
              onClick={handlePreview}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview Module
            </button>
          </div>

          <div className="border-t pt-6">
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Another Module
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-rose-50 flex items-start justify-center py-12">
      <form onSubmit={handleGenerate} className="w-full max-w-3xl p-8 bg-white/90 backdrop-blur rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-slate-800">Create Module</h1>

        <section className="mt-6">
          <label className="block text-sm font-medium text-slate-700">Module name</label>
          <input
            type="text"
            value={moduleName}
            onChange={e => setModuleName(e.target.value)}
            className="mt-2 block w-full rounded border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="e.g. Introduction to React"
          />
        </section>

        <section className="mt-6">
          <label className="block text-sm font-medium text-slate-700">Attachment (PDF or Word)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleAttachmentChange}
            className="mt-2"
          />
          {attachment && <p className="mt-2 text-sm text-slate-600">Selected: {attachment.name}</p>}
        </section>

        <section className="mt-4">
          <label className="block text-sm font-medium text-slate-700">Optional template (HTML)</label>
          <input
            type="file"
            accept=".html,text/html"
            onChange={handleTemplateChange}
            className="mt-2"
          />
          {template && <p className="mt-2 text-sm text-slate-600">Selected template: {template.name}</p>}
        </section>

        <section className="mt-6">
          <label className="block text-sm font-medium text-slate-700">Image / Video URLs</label>
          <p className="text-xs text-slate-500">Add links to external images or videos. Press + to add more.</p>
          <div className="mt-2 space-y-2">
            {urls.map((u, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={u}
                  onChange={e => handleUrlChange(i, e.target.value)}
                  placeholder="https://example.com/media.jpg"
                  className="flex-1 rounded border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button type="button" onClick={() => removeUrl(i)} aria-label="Remove URL" className="w-9 h-9 inline-flex items-center justify-center rounded bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100">
                  −
                </button>
              </div>
            ))}
            <div>
              <button type="button" onClick={addUrl} className="inline-flex items-center gap-2 px-3 py-2 bg-sky-50 text-sky-600 rounded border border-sky-100 hover:bg-sky-100">
                <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-sky-600 text-white text-sm">+</span>
                Add URL
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} className="mt-2 block w-full rounded border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">No. of questions</label>
            <select value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} className="mt-2 block w-full rounded border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400">
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="text-sm text-rose-600">{message}</div>
          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate module'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
