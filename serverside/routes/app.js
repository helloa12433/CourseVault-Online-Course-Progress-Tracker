const metadataRoutes = require('./routes/metadata');
// ... existing app.use lines
app.use('/api/metadata', metadataRoutes);
