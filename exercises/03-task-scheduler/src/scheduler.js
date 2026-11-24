function resolveOrder(tasks) {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const order = [];
  const done=new Set();
  const inProgress=new Set();

  function visit(id) {
    if(done.has(id)) return;
    if(inProgress.has(id)) throw new Error(`Cycle detected at ${id}`);
    inProgress.add(id);
    const t = byId.get(id);
    if (!t) throw new Error(`Unknown task: ${id}`);
    for (const d of t.deps) visit(d);
    inProgress.delete(id);
    order.push(id);
    done.add(id);
  }

  for (const t of tasks) visit(t.id);
  return order;
}

module.exports = { resolveOrder };
