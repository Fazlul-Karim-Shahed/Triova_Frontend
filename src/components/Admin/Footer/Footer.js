
import React from 'react'

export default function Footer() {
  return (
      <div className='s'>
          <footer className="footer footer-center bg-base-300 text-base-content p-4">
              <aside>
                  <p>Copyright © ${new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
              </aside>
          </footer>
    </div>
  )
}
