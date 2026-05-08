const Footer = ({
    links
}) => {
    const copyrightYears = `2026-${new Date().getFullYear()}`;

    return <footer 
        id="lv-footer" 
        className="lv-footer"
    >
        <a 
            className="lv-link lv-footer__website"
            target="_blank"
            href="https://github.com/mawen12/logs-viewer"
            rel="me noreferrer"
        >
            Github.com
        </a>

        {links.map(({href, Icon, title}) => (
            <a
                className="lv-link lv-footer__link"
                target="_blank"
                href={href}
                rel="help noreferrer"
                key={`${href}-${title}`}
            >
                <Icon/>
                {title}
            </a>
        ))}

        <div className="lv-footer__copyright">&copy; {copyrightYears} LogsViewer.</div>
    </footer>
}

export default Footer;