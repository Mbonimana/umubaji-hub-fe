# andasy.hcl app configuration file generated for umubaji-hub-fe on Tuesday, 25-Nov-25 16:18:47 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "umubaji-hub-fe"

app {

  env = {}

  port = 5173

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "umubaji-hub-fe"
  }

}
