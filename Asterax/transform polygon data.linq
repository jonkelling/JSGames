<Query Kind="Program" />

#region String Templates
private static readonly string format = @"				{{
					""density"": 2, ""friction"": 0, ""bounce"": 0, 
					""filter"": {{ ""categoryBits"": 1, ""maskBits"": 65535 }},
					""shape"": [   {0}   ]
				}}  ";
private static readonly string fileFormat = @"
		""{0}"": [

{1}

		]";
#endregion

void Main()
{
	var imageSize = new { Width = 300d, Height = 300d, HalfWidth = 300d/2, HalfHeight = 300d/2 };
	var output =
		from line in
			from line in
				from line in File.ReadAllLines(@"\\psf\Home\Desktop\ship_verts.h")//.Dump()
				let rowHeaderMatch = Regex.Match(line, @"// row (\d+), col (\d+)")
				let rowType = rowHeaderMatch.Success         ? RowType.Header :
							Regex.IsMatch(line, @"^[-\d]") ? RowType.Data :
															RowType.Ignored
				where rowType != RowType.Ignored
				select new { header = SetOrGetCurrentHeader(line, rowType), line, rowType }
			where line.rowType == RowType.Data
			let rowHeaderMatch = Regex.Match(line.header, @"// row (\d+), col (\d+)")
			let row = rowHeaderMatch.Groups[1].Value.ToDouble() - 1 // so that it's 0-based
			let col = rowHeaderMatch.Groups[2].Value.ToDouble() - 1 // so that it's 0-based
			let coords = line.line.Split(',')
			let x = coords[0].ToDouble()
			let x1 = x + ((imageSize.Width / 2) * (col/2)) + imageSize.HalfWidth / 2 //* (col/2)
			let y = coords[1].ToDouble() * -1
			let y1 = y + ((imageSize.Height / 2) * (row/2)) + imageSize.HalfHeight / 2 //* (row/2)
			let newLine = x1 + ", " + y1
			select new { line.header, line.line, newLine, line.rowType, x, y, row, col }
		group line by new { line.header, line.row, line.col } into lines
		orderby lines.Key.row, lines.Key.col
		select new {
			lines.Key.row,
			lines.Key.col,
			output = string.Format(format, lines.Select (l => l.newLine).ToDelimitedString("  ,  "), lines.Key.header.Substring(3))
		};
	
	var results =
		from x in output
		group x by Math.Floor(Convert.ToDouble(x.col)/2) into sets
		select sets;
		
	var results2 = from line in results
				   select string.Format(fileFormat, "ship" + line.Key, line.Select (l => l.output).ToDelimitedString(",\n"));
	
	results2.ToDelimitedString("\n\n\t\t,\n").Dump();
}

// Define other methods and classes here
enum RowType
{
	Ignored,
	Header,
	Data,
}

string currentHeader = null;
string SetOrGetCurrentHeader(string line, RowType rowType)
{
	switch (rowType)
	{
		case RowType.Header: return currentHeader = line;
		case RowType.Data: return currentHeader;
		default: break;
	}
	return null;
}