from datasets.builder import BuilderConfig
from datasets.utils.version import Version
from dataclasses import field

# Define a new version field with default_factory
new_version_field = field(default_factory=lambda: Version("1.0.0"))

# Apply the new version field to the BuilderConfig class
BuilderConfig.__dataclass_fields__['version'] = new_version_field
