/**
 * Pre-generated ASCII Art for "OWEN DINSMORE"
 * Using ANSI Shadow font from Figlet
 */

export const ASCII_ART = {
  owen: ` ██████╗ ██╗    ██╗███████╗███╗   ██╗
██╔═══██╗██║    ██║██╔════╝████╗  ██║
██║   ██║██║ █╗ ██║█████╗  ██╔██╗ ██║
██║   ██║██║███╗██║██╔══╝  ██║╚██╗██║
╚██████╔╝╚███╔███╔╝███████╗██║ ╚████║
 ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═══╝`,

  dinsmore: `██████╗ ██╗███╗   ██╗███████╗███╗   ███╗ ██████╗ ██████╗ ███████╗
██╔══██╗██║████╗  ██║██╔════╝████╗ ████║██╔═══██╗██╔══██╗██╔════╝
██║  ██║██║██╔██╗ ██║███████╗██╔████╔██║██║   ██║██████╔╝█████╗
██║  ██║██║██║╚██╗██║╚════██║██║╚██╔╝██║██║   ██║██╔══██╗██╔══╝
██████╔╝██║██║ ╚████║███████║██║ ╚═╝ ██║╚██████╔╝██║  ██║███████╗
╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝`,

  full: ` ██████╗ ██╗    ██╗███████╗███╗   ██╗
██╔═══██╗██║    ██║██╔════╝████╗  ██║
██║   ██║██║ █╗ ██║█████╗  ██╔██╗ ██║
██║   ██║██║███╗██║██╔══╝  ██║╚██╗██║
╚██████╔╝╚███╔███╔╝███████╗██║ ╚████║
 ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═══╝
██████╗ ██╗███╗   ██╗███████╗███╗   ███╗ ██████╗ ██████╗ ███████╗
██╔══██╗██║████╗  ██║██╔════╝████╗ ████║██╔═══██╗██╔══██╗██╔════╝
██║  ██║██║██╔██╗ ██║███████╗██╔████╔██║██║   ██║██████╔╝█████╗
██║  ██║██║██║╚██╗██║╚════██║██║╚██╔╝██║██║   ██║██╔══██╗██╔══╝
██████╔╝██║██║ ╚████║███████║██║ ╚═╝ ██║╚██████╔╝██║  ██║███████╗
╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝`
};

export function createASCIIBanner(split = true) {
  const container = document.createElement('div');
  container.className = 'ascii-banner';
  container.setAttribute('aria-hidden', 'true');

  if (split) {
    // Create separate pre elements for OWEN and DINSMORE
    const owenPre = document.createElement('pre');
    owenPre.className = 'ascii-banner-line ascii-banner-line-1';
    owenPre.textContent = ASCII_ART.owen;

    const dinsmorePre = document.createElement('pre');
    dinsmorePre.className = 'ascii-banner-line ascii-banner-line-2';
    dinsmorePre.textContent = ASCII_ART.dinsmore;

    container.appendChild(owenPre);
    container.appendChild(dinsmorePre);
  } else {
    const fullPre = document.createElement('pre');
    fullPre.className = 'ascii-banner-line';
    fullPre.textContent = ASCII_ART.full;
    container.appendChild(fullPre);
  }

  return container;
}
