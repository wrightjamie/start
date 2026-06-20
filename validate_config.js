const fs = require('fs');

function validateConfig(configPath) {
  let errors = [];
  let config;

  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(raw);
  } catch (e) {
    console.error(`❌ Error reading or parsing JSON: ${e.message}`);
    process.exit(1);
  }

  if (!config.title || typeof config.title !== 'string') {
    errors.push("Root must have a 'title' string property.");
  }

  if (!config.layout || !Array.isArray(config.layout)) {
    errors.push("Root must have a 'layout' array property.");
  } else {
    config.layout.forEach((node, i) => validateNode(node, `layout[${i}]`, errors));
  }

  if (errors.length > 0) {
    console.error(`❌ Validation Failed with ${errors.length} errors:`);
    errors.forEach(e => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log("✅ Validation Passed: config.json is valid.");
  }
}

function validateNode(node, path, errors) {
  if (!node.type) {
    errors.push(`Node at ${path} is missing 'type'.`);
    return;
  }

  switch (node.type) {
    case 'row':
    case 'column':
      if (!node.children || !Array.isArray(node.children)) {
        errors.push(`Node ${path} of type '${node.type}' must have a 'children' array.`);
      } else {
        node.children.forEach((child, i) => validateNode(child, `${path}.children[${i}]`, errors));
      }
      break;
    
    case 'grid':
      if (!node.links || !Array.isArray(node.links)) {
        errors.push(`Grid node at ${path} must have a 'links' array.`);
      } else {
        node.links.forEach((link, i) => {
          if (!link.title) errors.push(`Link at ${path}.links[${i}] is missing 'title'.`);
          if (!link.url) errors.push(`Link at ${path}.links[${i}] is missing 'url'.`);
          if (!link.icon) errors.push(`Link at ${path}.links[${i}] is missing 'icon'.`);
        });
      }
      break;

    case 'widget':
      if (!node.widgetType) {
        errors.push(`Widget node at ${path} must have a 'widgetType'.`);
      } else if (node.widgetType === 'weather') {
        if (!node.latitude || typeof node.latitude !== 'number') {
          errors.push(`Weather widget at ${path} must have a 'latitude' number.`);
        }
        if (!node.longitude || typeof node.longitude !== 'number') {
          errors.push(`Weather widget at ${path} must have a 'longitude' number.`);
        }
      }
      break;
    
    default:
      errors.push(`Node at ${path} has unknown type '${node.type}'.`);
  }
}

// Run validation on config.json
validateConfig('./config.json');
