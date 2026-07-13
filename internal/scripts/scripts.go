package scripts

import _ "embed"

var (
	//go:embed startup.sh.tmpl
	StartShTemplate string
	//go:embed index.sh.tmpl
	IndexShTemplate string
	//go:embed query.sh.tmpl
	QueryShTemplate string
	//go:embed clean.sh.tmpl
	CleanShTmpleate string

	//go:embed agent.sh
	AgentSh string
	//go:embed agent_lib.sh
	LibSh string
	//go:embed agent_index.sh
	IndexSh string
	//go:embed agent_search.sh
	SearchSh string
)
