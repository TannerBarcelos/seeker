//
//  ContentView.swift
//  seeker
//
//  Created for seeker.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "headphones")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, seeker")
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
