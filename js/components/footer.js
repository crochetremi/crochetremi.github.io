export function renderFooter(container, siteData) {
  if (!container) return;

  const year = new Date().getFullYear();

  container.innerHTML = `
    <div class="container footer__inner">
      <p>© ${year} ${siteData.fullName} — ${siteData.footerNote}</p>
      <div class="footer__links">
        <a href="./cv.html" class="footer__link">CV</a>
        <a href="./contact.html" class="footer__link">Contact</a>
        <a href="${siteData.linkedin.url}"
           class="footer__link"
           target="_blank"
           rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  `;
}