function Bottles() {
  const [bottles, setBottles] = React.useState();

  React.useEffect(() => {
    fetch("https://app.tea.xyz/api/bottles")
      .then((res) => res.json())
      .then((res) => setBottles(res));
  }, []);

  if (!bottles) return null;

  const names = [...new Set(bottles.map((b) => b.name))];

  return (
    <div>
      <p>{names.length} packages</p>
      {names.map((name) => (
        <Bottle key={name} name={name} />
      ))}
    </div>
  );

  function Bottle({ name }) {
    const [expanded, toggleExpanded] = React.useState(false);
    const versions = [
      ...new Set(bottles.filter((b) => b.name === name).map((b) => b.version)),
    ];
    return (
      <div onClick={() => toggleExpanded(!expanded)}>
        <h3>{name}</h3>
        <h4>
          {versions.length} version{versions.length === 1 ? "" : "s"} bottled
        </h4>
        {expanded && (
          <table>
            <thead>
              <tr>
                <th>version</th>
                <th>darwin-aarch64</th>
                <th>darwin-x86-64</th>
                <th>linux-aarch64</th>
                <th>linux-x86-64</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => {
                const available = new Set(
                  bottles
                    .filter((b) => b.name === name && b.version == v)
                    .map((b) => `${b.platform}-${b.arch}`)
                );
                return (
                  <tr key={v}>
                    <th>{v}</th>
                    <td>{available.has("darwin-aarch64") ? "✅" : "❌"}</td>
                    <td>{available.has("darwin-x86-64") ? "✅" : "❌"}</td>
                    <td>{available.has("linux-aarch64") ? "✅" : "❌"}</td>
                    <td>{available.has("linux-x86-64") ? "✅" : "❌"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
ReactDOM.render(React.createElement(Bottles), document.getElementById("app"));
